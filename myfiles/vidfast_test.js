const crypto = require("crypto");

function hexToBytes(hexString) {
    return Buffer.from(hexString, 'hex')
}

function bytesToHex(byteArray) {
    return Buffer.from(byteArray).toString('hex');
}

// Convert Hex to Bytes
const aesKeyBytes = Buffer.from("f32d7016705d4d6c71b5cda311073a06703c6f66bf9f22a8f268479b08443d3e", "hex");
const aesIvBytes = Buffer.from("f0d1a42026e458a63c77506dac76ae8d", "hex");
const xorSeedKeyBytes = Buffer.from("26ce1e9", "hex");
//console.log(new Uint8Array(aesIvBytes).toString())

// Current timestamp as BigInt
let timestampBigInt = 1773462680330n //BigInt(Date.now()); // Dynamic

const timestampByteArray = new Uint8Array(8);

for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
    timestampByteArray[byteIndex] = Number(timestampBigInt & 255n);
    timestampBigInt >>= 8n;
}

//timestampByteArray = new Uint8Array([138,208,96,231,156,1,0,0])

// Get site data
var randomIvBytes = new Uint8Array([
        68,
        224,
        44,
        72,
        99,
        96,
        68,
        180,
        8,
        58,
        219,
        54,
        79,
        102,
        224,
        198
    ]);
let siteDataString = "he-AK4Yl-GE2J1jxVOwskal2p401HAakwTpso0OAk02JciSmHvzzog1Hk7VX_zRhUeoD_qIOMk_9qfNnXCqKll";
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

console.log("\nStep 1 Output: ", new Uint8Array(xorResult).toString())


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

const ksaSeed = new Uint8Array(Buffer.concat([randomIvBytes, xorSeedKeyBytes, aesIvBytes]));

console.log("\nStep 3 Seed: ", new Uint8Array(ksaSeed).toString());

let ksaHash = crypto.createHash("sha256").update(ksaSeed).digest();

console.log("\nStep 3 Hash: ", new Uint8Array(ksaHash).toString())

function generateKSA(hashBuffer, length) {
    const seedBuffer = Buffer.isBuffer(hashBuffer)
    ? hashBuffer: Buffer.from(hashBuffer);

    const chunk0 = seedBuffer.readUInt32LE(0);
    const chunk1 = seedBuffer.readUInt32LE(4);
    const chunk2 = seedBuffer.readUInt32LE(8);
    const chunk3 = seedBuffer.readUInt32LE(12);

    let prngState = (chunk0 ^ chunk1 ^ chunk2 ^ chunk3) >>> 0;

    let sbox = Array.from({
        length: length
    }, (_, k) => k);

    for (let i = (length - 1); i > 0; i--) {

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

const ksaResult = generateKSA(ksaHash, 256);

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
const inputArr = payloadSwaps;
//const inputArr = new Uint8Array([228,62,81,79,2,102,225,155,51,52,130,227,119,13,60,61,196,165,33,4,122,50,181,245,6,176,28,127,199,36,8,169,251,90,78,0,19,226,155,146,104,154,159,243,141,214,143,12,99,180,120,191,114,11,10,229,29,82,153,144,1,143,125,115,93,87,31,63,164,150,172,155,129,139,70,8,180,98,18,141,174,10,116,181,80,72,116,39,111,54,169,76,181,109,203,178,42,161,113,121,111,238,84,14,107,53,149,197,41,218,180,97]);
//const seed_4 = new Uint8Array([248,165,16,104,194,248,102,2,80,41,247,218,26,198,127,22,206,77,15,50,126,114,155,35]);
const seed_4 = new Uint8Array(Buffer.concat([xorSeedKeyBytes, randomIvBytes]));
let hash_4 = crypto.createHash("sha256").update(seed_4).digest();
const permutationTableLength = payloadSwaps.length / 16;

const ksaResult2 = generateKSA(hash_4, 7)

function shuffleBlocks(payload, pBox) {
    if (payload.length !== 112) {
        throw new Error("Payload must be exactly 112 bytes.");
    }
    if (pBox.length !== 7) {
        throw new Error("P-Box must be exactly 7 elements.");
    }

    const blockSize = 16;
    const shuffledPayload = new Uint8Array(112);

    for (let i = 0; i < pBox.length; i++) {
        const sourceBlockIndex = pBox[i];
        
        const sourceOffset = sourceBlockIndex * blockSize;
        const destOffset = i * blockSize;

        for (let j = 0; j < blockSize; j++) {
            shuffledPayload[destOffset + j] = payload[sourceOffset + j];
        }
    }

    return shuffledPayload;
}

const shuffledData = shuffleBlocks(inputArr, ksaResult2.S);
console.log("\nStep 4 Output: ", shuffledData.toString());
console.log("\nStep 4 Seed: ", seed_4.toString());


/*****************************************/
/*-------- STEP 5 TRANSFORMATION --------*/
/*****************************************/
