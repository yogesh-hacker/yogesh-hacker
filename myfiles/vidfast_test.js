const crypto = require("crypto");

function hexToBytes(hexString) {
    return Buffer.from(hexString, 'hex')
}

function bytesToHex(byteArray) {
    return Buffer.from(byteArray).toString('hex');
}

// Convert Hex to Bytes
const aesKeyBytes = Buffer.from("42f082221250ad12dbcb8dbbe310d2319a66bb50dec37bb725d6ecac0a0b836d", "hex");
const aesIvBytes = Buffer.from("b8a4acdfcef043ac437daaf51d6eab13", "hex");
const xorSeedKeyBytes = Buffer.from("f8a51068c2f86602", "hex");

// Current timestamp as BigInt
/*
let timestampBigInt = 1773379459067n //BigInt(Date.now()); // Dynamic
const timestampByteArray = new Uint8Array(8);

for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
    timestampByteArray[byteIndex] = Number(timestampBigInt & 255n);
    timestampBigInt >>= 8n;
}
*/

timestampByteArray = new Uint8Array([[234,171,178,229,156,1,0,0]])

// Get site data
var randomIvBytes = new Uint8Array([218,252,68,211,157,121,216,141,250,201,80,178,15,173,87,89]);
let siteDataString = "CvQFlRwfQ8Yu2cISxhNDqa6xEwoJIuBzTj1ILYQGdBZ3jVEvDZtq4BoGpUuLDTmoEvZU-5yh7q-95O0ptb5lff";
const siteDataBuffer = Buffer.from(siteDataString, "utf8");

const combinedInputBytes = new Uint8Array(
    Buffer.concat([randomIvBytes, timestampByteArray, siteDataBuffer])
);

// Encrypt the data
const aesCipher = crypto.createCipheriv("aes-256-cbc", aesKeyBytes, aesIvBytes);
const encryptedBuffer = Buffer.concat([
    aesCipher.update(combinedInputBytes),
    aesCipher.final()
]);

const encryptedByteArray = new Uint8Array(encryptedBuffer);

console.log("Step 0 Output: ", new Uint8Array(encryptedByteArray).toString())

// SHA-256
const xorSeed = new Uint8Array(Buffer.concat([xorSeedKeyBytes, randomIvBytes]));

// XOR
let xorHash = crypto.createHash("sha256").update(xorSeed).digest();

var xorResult = new Uint8Array(encryptedByteArray.length);

for (let i = 0; i < encryptedByteArray.length; i++) {

    // every 32 bytes generate next hash block
    if (i > 0 && i % xorHash.length === 0) {
        xorHash = crypto.createHash("sha256").update(xorHash).digest();
    }

    // XOR
    xorResult[i] = encryptedByteArray[i] ^ xorHash[i % xorHash.length];
}

console.log("Step 1 Output: ", new Uint8Array(xorResult).toString())

// Step 2 Transformation
const step2InputBytes = xorResult;
const transformSeed = new Uint8Array(Buffer.concat([aesKeyBytes, randomIvBytes]));

// TO DO: FIND THE TRANSFORMATION METHOD
let transformHash = crypto.createHash("sha256").update(transformSeed).digest();

function transformByte(inputByte, keyByte) {

    // Determine rotation amount (0–7)
    const rotation = keyByte % 8;

    // Rotate the input byte left by the rotation amount
    const rotatedByte =
        ((inputByte << rotation) | (inputByte >> (8 - rotation))) & 0xFF;

    // Mix the key with a constant mask
    const keyMask = keyByte ^ 0xA5;

    // Combine rotated byte with masked key
    const outputByte = (rotatedByte + keyMask) & 0xFF;

    return outputByte;
}

const transformOutput = Buffer.alloc(xorResult.length);
const transformBlockSize = transformHash.length;

for (let i = 0; i < xorResult.length; i++) {
    transformOutput[i] = transformByte(
        xorResult[i],
        transformHash[i % transformBlockSize]
    );
}

console.log("\nStep 2 Output/Payload: ", new Uint8Array(transformOutput).toString())

const ksaSeed = new Uint8Array(
    Buffer.concat([randomIvBytes, xorSeedKeyBytes, aesIvBytes])
);

console.log("\nStep 3 Seed: ", new Uint8Array(ksaSeed).toString());

let ksaHash = crypto.createHash("sha256").update(ksaSeed).digest();

console.log("\nStep 3 Hash: ", new Uint8Array(ksaHash).toString())

function generateKSA(hashBuffer) {
    const seedBuffer = Buffer.isBuffer(hashBuffer)
        ? hashBuffer
        : Buffer.from(hashBuffer);

    const chunk0 = seedBuffer.readUInt32LE(0);
    const chunk1 = seedBuffer.readUInt32LE(4);
    const chunk2 = seedBuffer.readUInt32LE(8);
    const chunk3 = seedBuffer.readUInt32LE(12);

    let prngState = (chunk0 ^ chunk1 ^ chunk2 ^ chunk3) >>> 0;

    let sbox = Array.from({ length: 256 }, (_, k) => k);

    for (let i = 255; i > 0; i--) {

        prngState ^= prngState << 13;
        prngState ^= prngState >>> 17;
        prngState ^= prngState << 5;

        prngState = prngState >>> 0;

        let swapIndex = prngState % (i + 1);

        let temp = sbox[i];
        sbox[i] = sbox[swapIndex];
        sbox[swapIndex] = temp;
    }

    return {
        S: sbox,
        finalState: prngState
    };
}

const ksaResult = generateKSA(ksaHash);

const payloadBytes = transformOutput;

console.log("\nKSA(S-Box):", ksaResult.S.toString());
console.log("\nKSA(State):", ksaResult.finalState.toString());

var payloadSwaps = [];
for (var i = 0; i < payloadBytes.length; i++) {
    var lookupIndex = payloadBytes[i];
    var sboxValue = ksaResult.S[lookupIndex];
    payloadSwaps.push(sboxValue)
}

console.log("\nPayload Swaps: ", JSON.stringify(payloadSwaps)); // Not matching all bytes [0-15] is matching only

/******** Above this line the algorithm re-constructed and matching as expected ********/

/*
// --- Step 5: Block-Level Shuffle ---
// The payload is 112 bytes. 112 / 16 = 7 blocks.
const numBlocks = output_4.length / 16; 
let blockIndices = Array.from({ length: numBlocks }, (_, k) => k);

// Crucial: Continue using the cascading state from the KSA
let state = ksaResult.finalState;

// Fisher-Yates shuffle for the 7 block indices using Xorshift32
for (let i = numBlocks - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = state >>> 0; // Force unsigned 32-bit
    
    let j = state % (i + 1);
    
    // Swap block indices
    let temp = blockIndices[i];
    blockIndices[i] = blockIndices[j];
    blockIndices[j] = temp;
}

console.log("\nBlock Shuffle Order:", blockIndices);

// Apply the block shuffle to output_4
let blockShuffledPayload = [];
for (let i = 0; i < numBlocks; i++) {
    let sourceBlockIdx = blockIndices[i];
    let start = sourceBlockIdx * 16;
    let block = output_4.slice(start, start + 16);
    blockShuffledPayload.push(...block);
}

// --- Step 6: Byte-Level Shuffle ---
// Initialize byte indices 0 to 111
let byteIndices = Array.from({ length: output_4.length }, (_, k) => k);

// Fisher-Yates shuffle for the 112 byte indices (continuing with the SAME state)
for (let i = output_4.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = state >>> 0;
    
    let j = state % (i + 1);
    
    // Swap byte indices
    let temp = byteIndices[i];
    byteIndices[i] = byteIndices[j];
    byteIndices[j] = temp;
}

console.log("\nByte Shuffle Indices (First 10):", byteIndices.slice(0, 10));

// Apply the final byte shuffle
let finalPayload = new Uint8Array(output_4.length);
for (let i = 0; i < output_4.length; i++) {
    // Depending on the obfuscator's specific assembly mapping, apply the shuffle.
    // If this forward mapping yields malformed data, swap the assignment to:
    // finalPayload[byteIndices[i]] = blockShuffledPayload[i];
    finalPayload[i] = blockShuffledPayload[byteIndices[i]];
}

console.log("\nFinal Obfuscated Payload (Hex):", Buffer.from(finalPayload).toString('hex'));
console.log("Final Obfuscated Payload (Base64):", Buffer.from(finalPayload).toString('base64'));
*/
