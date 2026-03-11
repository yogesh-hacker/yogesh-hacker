const crypto = require("crypto");

/*****
In This file all the dynamic constants
is written to test. So please change with
caution.
*****/
function hextoBytes(s) {
    return Buffer.from(s, 'hex')
}
function bytesToHex(bytes) {
    return Buffer.from(bytes).toString('hex');
}

// Convert Hex to Bytes
const mainKeyBytes = Buffer.from("fe1a8a6b6670943ce33ce4da23a6aea146f4a3eadaf7bc89d0ccc6220784a35e", "hex");
const mainIvBytes = Buffer.from("b272b6300854c60e8802abe70eee425d", "hex");
const mainXorKeyBytes = Buffer.from("a6250fee53370b0cea1c", "hex");

// Current timestamp as BigInt
let timestampBigInt = 1773240625984n //BigInt(Date.now()); // Dynamic
const timestampBytes = new Uint8Array(8);

for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
    timestampBytes[byteIndex] = Number(timestampBigInt & 255n);
    timestampBigInt >>= 8n;
}

// Get site data
var randomIv = new Uint8Array([
        13,
        151,
        66,
        162,
        56,
        136,
        44,
        86,
        114,
        57,
        157,
        87,
        54,
        205,
        248,
        9
    ]); //crypto.getRandomValues(new Uint8Array(16)); // Dynamic
let siteData = "zJKmWNP0KZuxoL2fFG5pUgqz-HgK9Ox9vdTglSoKkp_2vrcsF3Vrxsq0Ie4smbkwHJ4DO-lGbUOA-kqt8C-W00"; // Dynamic
const siteDataBytes = Buffer.from(siteData, "utf8");
const combinedBuffers = new Uint8Array(Buffer.concat([randomIv, timestampBytes, siteDataBytes]));

// Encrypt the data
const cipher = crypto.createCipheriv("aes-256-cbc", mainKeyBytes, mainIvBytes);
const encryptedBuffer = Buffer.concat([cipher.update(combinedBuffers), cipher.final()]);
const encryptedBytes = new Uint8Array(encryptedBuffer);

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

// Step 2 Tranformantion
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

console.log("\nStep 2 Output: ", new Uint8Array(output).toString())

const seed_3 = new Uint8Array(Buffer.concat([randomIv, mainXorKeyBytes, mainIvBytes]));
console.log("\nStep 3 Seed: ", new Uint8Array(seed_3).toString());
let hash_3 = crypto.createHash("sha256").update(seed_3).digest();
console.log("\nStep 3 Hash: ", new Uint8Array(hash_3).toString())

/* ^^^^^^ Above this line everything matches with the site VM behaviour. **/
function rc4(key, data) {

    // Initialize S array (0..255)
    const S = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
        S[i] = i;
    }

    // Key Scheduling Algorithm (KSA)
    let j = 0;
    for (let i = 0; i < 256; i++) {

        // update index using key
        j = (j + S[i] + key[i % key.length]) & 255;

        // swap values
        let temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }
    console.log(S)
    // Pseudo Random Generation Algorithm (PRGA)
    let i = 0;
    j = 0;

    const output = new Uint8Array(data.length);

    for (let n = 0; n < data.length; n++) {

        // increment indexes
        i = (i + 1) & 255;
        j = (j + S[i]) & 255;

        // swap again
        let temp = S[i];
        S[i] = S[j];
        S[j] = temp;

        // generate keystream byte
        const K = S[(S[i] + S[j]) & 255];

        // XOR with data
        output[n] = data[n] ^ K;
    }

    return output;
}



output_3 = rc4(mainKeyBytes, output)
//console.log(new Uint8Array(output_3).toString())
