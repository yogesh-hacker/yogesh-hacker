const crypto = require("crypto");

function hextoBytes(s) {
    return Buffer.from(s, 'hex')
}
function bytesToHex(bytes) {
    return Buffer.from(bytes).toString('hex');
}

// Convert Hex to Bytes
const mainKeyBytes = Buffer.from("42f082221250ad12dbcb8dbbe310d2319a66bb50dec37bb725d6ecac0a0b836d", "hex");
const mainIvBytes = Buffer.from("b8a4acdfcef043ac437daaf51d6eab13", "hex");
const mainXorKeyBytes = Buffer.from("f8a51068c2f86602", "hex");

// Current timestamp as BigInt
let timestampBigInt = 1773379459067n //BigInt(Date.now()); // Dynamic
const timestampBytes = new Uint8Array(8);


for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
    timestampBytes[byteIndex] = Number(timestampBigInt & 255n);
    timestampBigInt >>= 8n;
}

// Get site data
var randomIv = new Uint8Array([
        191,
        156,
        88,
        142,
        123,
        89,
        29,
        167,
        71,
        132,
        224,
        159,
        0,
        86,
        193,
        106
    ]); //crypto.getRandomValues(new Uint8Array(16)); // Dynamic
let siteData = "CvQFlRwfQ8Yu2cISxhNDqa-3eVAbyiV2T7jqbhINyh5_H3dPaHBU5-20ZPzXwIH0EvZU-5yh7q-95O0ptb5lff"; // Dynamic
const siteDataBytes = Buffer.from(siteData, "utf8");
const combinedBuffers = new Uint8Array(Buffer.concat([randomIv, timestampBytes, siteDataBytes]));

// Encrypt the data
const cipher = crypto.createCipheriv("aes-256-cbc", mainKeyBytes, mainIvBytes);
const encryptedBuffer = Buffer.concat([cipher.update(combinedBuffers), cipher.final()]);
const encryptedBytes = new Uint8Array(encryptedBuffer);

console.log("Step 0 Output: ", new Uint8Array(encryptedBytes).toString())

// SHA-256
const seed = new Uint8Array(Buffer.concat([mainXorKeyBytes, randomIv]));
// XOR
let hash = crypto.createHash("sha256").update(seed).digest();

var final = new Uint8Array(encryptedBytes.length);
for (let i = 0; i < encryptedBytes.length; i++) {

    // every 32 bytes generate next hash block
    if (i > 0 && i % hash.length === 0) {
        hash = crypto.createHash("sha256").update(hash).digest();
    }

    // XOR
    final[i] = encryptedBytes[i] ^ hash[i % hash.length];
}

console.log("Step 1 Output: ", new Uint8Array(final).toString())

// Step 2 Transformation
const s2_input = final;
const seed_2 = new Uint8Array(Buffer.concat([mainKeyBytes, randomIv]));

// TO DO: FIND THE TRANSFORMATION METHOD
let hash_2 = crypto.createHash("sha256").update(seed_2).digest();


function transformByte(inputByte, keyByte) {
    // Determine rotation amount (0–7)
    const rotation = keyByte % 8;

    // Rotate the input byte left by the rotation amount
    const rotatedByte = ((inputByte << rotation) | (inputByte >> (8 - rotation))) & 0xFF;

    // Mix the key with a constant mask
    const keyMask = keyByte ^ 0xA5; // 165 in hex

    // Combine rotated byte with masked key
    const outputByte = (rotatedByte + keyMask) & 0xFF;

    return outputByte;
}

const output = Buffer.alloc(final.length);
const blockSize = hash_2.length; // 32

for (let i = 0; i < final.length; i++) {
    output[i] = transformByte(final[i], hash_2[i % blockSize]);
}

console.log("\nStep 2 Output/Payload: ", new Uint8Array(output).toString())

const seed_3 = new Uint8Array(Buffer.concat([randomIv, mainXorKeyBytes, mainIvBytes]));
console.log("\nStep 3 Seed: ", new Uint8Array(seed_3).toString());
let hash_3 = crypto.createHash("sha256").update(seed_3).digest();
console.log("\nStep 3 Hash: ", new Uint8Array(hash_3).toString())

function generateKSA(derivedBufferArray) {
    // Ensure the input is a Node.js Buffer
    const buffer1 = Buffer.isBuffer(derivedBufferArray)
    ? derivedBufferArray: Buffer.from(derivedBufferArray);

    // 1. Read the first four 32-bit chunks from the 32-byte buffer
    const chunk0 = buffer1.readUInt32LE(0);
    const chunk1 = buffer1.readUInt32LE(4);
    const chunk2 = buffer1.readUInt32LE(8);
    const chunk3 = buffer1.readUInt32LE(12);

    // 2. Fold them together using XOR to create the master seed / initial state
    let state = (chunk0 ^ chunk1 ^ chunk2 ^ chunk3) >>> 0;

    // 3. Initialize the state array S (0 to 255)
    let S = Array.from({
        length: 256
    }, (_, k) => k);

    // 4. Execute the reverse Fisher-Yates shuffle using Xorshift32
    for (let i = 255; i > 0; i--) {
        // Update PRNG state
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;

        // Force state to remain an unsigned 32-bit integer
        state = state >>> 0;

        // Calculate swap index
        let j = state % (i + 1);

        // Swap S[i] and S[j]
        let temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }

    return {
        S: S,
        finalState: state
    };
}

const ksaResult = generateKSA(hash_3);
const payload112 = output;
console.log("\nKSA(S-Box):", ksaResult.S.toString());
console.log("\nKSA(State):", ksaResult.finalState.toString());

var output_4 = [];
for (var i = 0; i < payload112.length; i++) {
    var index = payload112[i];
    var value = ksaResult.S[index];
    output_4.push(value)
}

console.log("\nPayload Swaps: ", JSON.stringify(output_4));

/******** Above this line the algorithm re-constructed and matching as expected ********/
