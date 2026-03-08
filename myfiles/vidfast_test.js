const crypto = require("crypto");

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

//console.log(new Uint8Array(mainIvBytes))

// Current timestamp as BigInt
let timestampBigInt = 1772977280750n //BigInt(Date.now()); // Dynamic
const timestampBytes = new Uint8Array(8);

for (let byteIndex = 0; byteIndex < 8; byteIndex++) {
    timestampBytes[byteIndex] = Number(timestampBigInt & 255n);
    timestampBigInt >>= 8n;
}

// Get site data
var randomIv = new Uint8Array([
    168,
    217,
    111,
    151,
    38,
    216,
    1,
    243,
    154,
    208,
    229,
    205,
    65,
    167,
    26,
    43
]); //crypto.getRandomValues(new Uint8Array(16)); // Dynamic
let siteData = "zJKmWNP0KZuxoL2fFG5pUgqz-HgK9Ox9vdTglSoKkp_63-6lVgRZ6IPaqjKoZMVzHJ4DO-lGbUOA-kqt8C-W00"; // Dynamic
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

// Step 2 Transformantion
// All of the values are exact replica of site
// Do not change any values except related to Step 2
const targetOutput = "1d93bbb5c4d246e9b7ea6bfb5c12c747eca2b96a190bf085e6a3ec82713820407b9565a31aa30061b25797c64873833c22558da0c620ce15f6d60401ef7ab042a8d0e01461cfdf417e8eb1e95e46d0d97384340d59cbdb6fcd0bf8fcffda53fe5732a75a28ec0cf8fcab01216973bca8";
const s2_input = final;
const s2_seed = new Uint8Array(Buffer.concat([mainKeyBytes, randomIv]));

// TO DO: FIND THE TRANSFORMATION METHOD
let hash_2 = crypto.createHash("sha256").update(s2_seed).digest();

const output = Buffer.alloc(final.length);

for (let i = 0; i < final.length; i++) {
    let prev = i === 0 ? 0 : output[i - 1];
    output[i] = (final[i] + hash_2[i % 32] + prev) % 256
}

console.log("Is Output Matched?: ", Buffer.from(final).toString("hex") == targetOutput)
