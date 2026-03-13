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
//console.log(new Uint8Array(aesIvBytes).toString())

// Current timestamp as BigInt
let timestampBigInt = 1773409212316n //BigInt(Date.now()); // Dynamic

const timestampByteArray = new Uint8Array(8);

for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
    timestampByteArray[byteIndex] = Number(timestampBigInt & 255n);
    timestampBigInt >>= 8n;
}

//timestampByteArray = new Uint8Array([138,208,96,231,156,1,0,0])

// Get site data
var randomIvBytes = new Uint8Array([
    222,
    134,
    112,
    236,
    82,
    157,
    168,
    148,
    180,
    242,
    57,
    83,
    95,
    165,
    27,
    139
]);
let siteDataString = "CvQFlRwfQ8Yu2cISxhNDqRpShw1r3PT8qMlyxVOM_7OiJFmhiHbIb9EtOxF6CP3nEvZU-5yh7q-95O0ptb5lff";
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


/*****************************************/
/*-------- STEP 2 TRANSFORMATION --------*/
/*****************************************/

const step2InputBytes = xorResult;
const transformSeed = new Uint8Array(Buffer.concat([aesKeyBytes, randomIvBytes]));
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


/*****************************************/
/*-------- STEP 3 TRANSFORMATION --------*/
/*****************************************/

const ksaSeed = new Uint8Array(
    Buffer.concat([randomIvBytes, xorSeedKeyBytes, aesIvBytes])
);

console.log("\nStep 3 Seed: ", new Uint8Array(ksaSeed).toString());

let ksaHash = crypto.createHash("sha256").update(ksaSeed).digest();

console.log("\nStep 3 Hash: ", new Uint8Array(ksaHash).toString())

function generateKSA(hashBuffer) {
    const seedBuffer = Buffer.isBuffer(hashBuffer)
    ? hashBuffer: Buffer.from(hashBuffer);

    const chunk0 = seedBuffer.readUInt32LE(0);
    const chunk1 = seedBuffer.readUInt32LE(4);
    const chunk2 = seedBuffer.readUInt32LE(8);
    const chunk3 = seedBuffer.readUInt32LE(12);

    let prngState = (chunk0 ^ chunk1 ^ chunk2 ^ chunk3) >>> 0;

    let sbox = Array.from({
        length: 256
    }, (_, k) => k);

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

    // force unsigned byte
    var lookupIndex = payloadBytes[i] & 0xff;

    // mask again for safety
    lookupIndex = lookupIndex % 256;

    var sboxValue = ksaResult.S[lookupIndex];

    payloadSwaps.push(sboxValue & 0xff);
}

console.log("\nPayload Swaps: ", JSON.stringify(payloadSwaps));


/*****************************************/
/*-------- STEP 4 TRANSFORMATION --------*/
/*****************************************/

const seed_4 = new Uint8Array(Buffer.concat([xorSeedKeyBytes, randomIvBytes]));

let hash_4 = crypto.createHash("sha256").update(seed_4).digest();

const permutationTableLength = payloadSwaps.length / 16;

console.log(new Uint8Array(hash_4).toString());
