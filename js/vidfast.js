/*!
 * Vidfast VM Encryption Pipeline – Deobfuscation
 * Author: Yogesh Kumar Jamre (Hacker India)
 * Year: 2026
 *
 * This project contains the reverse engineering and deobfuscation
 * of the Vidfast VM encryption pipeline for educational and research purposes.
 *
 * Copyright (c) 2026 Yogesh Kumar Jamre. All rights reserved.
 * Redistribution, reuse, modification, or integration of this code,
 * in part or whole, without proper credit or written permission
 * from the author is not allowed.
 *
 * If this work is used in any project or research, proper attribution
 * to the original author must be given. Unauthorized use without
 * credit may lead to legal action.
 *
 * Special thanks to Ciarands (https://github.com/Ciarands)
 * for explaining the VM architecture and helping in understanding
 * the virtual machine in depth.
 *
 * Contact: businesshackerindia@gmail.com
 */






/* DISCLAIMER: Some variable names may be without context you can rename them based on your interpretation*/


const crypto = require("crypto");

/* ------------------ UTILS ------------------ */

const hexToBytes = (hex) => Buffer.from(hex, "hex");
const bytesToHex = (bytes) => Buffer.from(bytes).toString("hex");

/* ------------------ KSA GENERATOR ------------------ */

function generateKSA(hashSeed, size) {

    const seed = Buffer.isBuffer(hashSeed) ? hashSeed : Buffer.from(hashSeed);

    const c0 = seed.readUInt32LE(0);
    const c1 = seed.readUInt32LE(4);
    const c2 = seed.readUInt32LE(8);
    const c3 = seed.readUInt32LE(12);

    let state = (c0 ^ c1 ^ c2 ^ c3) >>> 0;

    const S = Array.from({ length: size }, (_, i) => i);

    for (let i = size - 1; i > 0; i--) {

        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        state >>>= 0;

        const j = state % (i + 1);
        [S[i], S[j]] = [S[j], S[i]];
    }

    return { S, finalState: state };
}

/* ------------------ BYTE TRANSFORM ------------------ */

function transformByte(inputByte, keyByte) {

    const rotation = keyByte % 8;

    const rotated =
        ((inputByte << rotation) | (inputByte >> (8 - rotation))) & 0xff;

    const keyMask = keyByte ^ 0xa5;

    return (rotated + keyMask) & 0xff;
}

/* ------------------ BLOCK SHUFFLER ------------------ */

function shuffleBlocks(payload, pBox) {

    if (payload.length !== 112) throw Error("Payload must be exactly 112 bytes");
    if (pBox.length !== 7) throw Error("PBox must be 7 elements");

    const blockSize = 16;
    const result = new Uint8Array(112);

    for (let i = 0; i < pBox.length; i++) {

        const src = pBox[i] * blockSize;
        const dst = i * blockSize;

        for (let j = 0; j < blockSize; j++)
            result[dst + j] = payload[src + j];
    }

    return result;
}

/* ------------------ MAIN ------------------ */

async function main() {

    const pageUrl = "https://vidfast.pro/movie/533535";

    const response = await fetch(pageUrl, {
        method: "GET",
        headers: {
            Referer: "https://vidfast.pro/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10)"
        }
    });

    const html = await response.text();
    const match = html.match(/\\"en\\":\\"(.*?)\\"/);

    if (!match) {
        console.log("No data found!");
        process.exit();
    }

    const siteData = match[1];
    console.log(siteData);

    /* ------------------ STATIC KEYS ------------------ */

    const AES_KEY = hexToBytes(
        "e69cd71bc5f8dbf5e6c69abd5546af19f0de9525a88e03cc3c778d78ad2e962b"
    );

    const AES_IV = hexToBytes(
        "3f874462bdca9999f4738c0e8da896e9"
    );

    const XOR_SEED_KEY = hexToBytes(
        "21fdd6309703dd6"
    );

    /* ------------------ TIMESTAMP ------------------ */

    let timestamp = BigInt(Date.now());
    const timestampBytes = new Uint8Array(8);

    for (let i = 0; i < 8; i++) {
        timestampBytes[i] = Number(timestamp & 255n);
        timestamp >>= 8n;
    }

    /* ------------------ RANDOM IV ------------------ */

    const randomIV = crypto.getRandomValues(new Uint8Array(16));

    /* ------------------ STEP 0 (AES) ------------------ */

    const siteBuffer = Buffer.from(siteData, "utf8");

    const combinedInput = Buffer.concat([
        randomIV,
        timestampBytes,
        siteBuffer
    ]);

    const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, AES_IV);

    const encrypted = Buffer.concat([
        cipher.update(combinedInput),
        cipher.final()
    ]);

    const encryptedBytes = new Uint8Array(encrypted);

    console.log("Step 0 Output:", encryptedBytes.toString());

    /* ------------------ STEP 1 (XOR) ------------------ */

    const xorSeed = Buffer.concat([XOR_SEED_KEY, randomIV]);

    let xorHash = crypto.createHash("sha256").update(xorSeed).digest();

    const xorOutput = new Uint8Array(encryptedBytes.length);

    for (let i = 0; i < encryptedBytes.length; i++) {

        if (i > 0 && i % xorHash.length === 0)
            xorHash = crypto.createHash("sha256").update(xorHash).digest();

        xorOutput[i] = encryptedBytes[i] ^ xorHash[i % xorHash.length];
    }

    console.log("\nStep 1 Output:", xorOutput.toString());

    /* ------------------ STEP 2 (BYTE TRANSFORM) ------------------ */

    const transformSeed = Buffer.concat([AES_KEY, randomIV]);
    const transformHash = crypto.createHash("sha256").update(transformSeed).digest();

    const transformOutput = Buffer.alloc(xorOutput.length);

    for (let i = 0; i < xorOutput.length; i++)
        transformOutput[i] =
        transformByte(xorOutput[i], transformHash[i % transformHash.length]);

    console.log("\nStep 2 Output:", new Uint8Array(transformOutput).toString());

    /* ------------------ STEP 3 (KSA) ------------------ */

    const ksaSeed = Buffer.concat([randomIV, XOR_SEED_KEY, AES_IV]);

    const ksaHash = crypto.createHash("sha256").update(ksaSeed).digest();

    const ksa = generateKSA(ksaHash, 256);

    console.log("\nKSA(S-Box):", ksa.S.toString());
    console.log("\nKSA(State):", ksa.finalState.toString());

    const payloadSwaps = [];

    for (let b of transformOutput) {

        let idx = (b & 0xff) % 256;
        payloadSwaps.push(ksa.S[idx] & 0xff);
    }

    console.log("\nPayload Swaps:", JSON.stringify(payloadSwaps));

    /* ------------------ STEP 4 (BLOCK SHUFFLE) ------------------ */

    const permutationCount = payloadSwaps.length / 16;

    const seed4 = Buffer.concat([XOR_SEED_KEY, randomIV]);

    const hash4 = crypto.createHash("sha256").update(seed4).digest();

    const permKSA = generateKSA(hash4, permutationCount);

    console.log("Swap Order:", permKSA.S.toString());

    const shuffled = shuffleBlocks(payloadSwaps, permKSA.S);

    console.log("\nStep 4 Output:", shuffled.toString());

    /* ------------------ STEP 5 (FINAL PERMUTATION) ------------------ */

    const lengthByte = new Uint8Array([shuffled.length]);

    const seed5 = Buffer.concat([AES_KEY, randomIV, lengthByte]);

    const hash5 = crypto.createHash("sha256").update(seed5).digest();

    const sbox5 = generateKSA(hash5, 112).S;

    const finalPayload = [];

    for (let i = 0; i < sbox5.length; i++)
        finalPayload.push(shuffled[sbox5[i]]);

    const swapOrder = [];

    for (let v of permKSA.S)
        swapOrder.push(v, 0, 0, 0);

    const finalBuffer = Buffer.concat([
        Buffer.from(swapOrder),
        Buffer.from(finalPayload)
    ]);

    console.log("\nFinal Output:", new Uint8Array(finalBuffer).toString());

    /* ------------------ HASH FOOTER ------------------ */

    const hash6 = crypto.createHash("sha256").update(finalBuffer).digest();

    const hashPart = hash6.slice(0, 8);

    const numberBuf = Buffer.from([1]);
    const lengthBuf = Buffer.from([permutationCount, 0]);

    const finalPacket = Buffer.concat([
        numberBuf,
        randomIV,
        lengthBuf,
        finalBuffer,
        hashPart
    ]);

    console.log("\nLast Output:", new Uint8Array(finalPacket).toString());

    /* ------------------ CUSTOM BASE64 ------------------ */

    const baseChars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_".split("");

    const customMap = JSON.parse(
        '["s","Y","h","-","2","0","Z","v","6","C","x","f","i","F","e","T","P","z","c","M","U","X","m","d","n","B","5","8","1","q","t","a","H","S","w","O","k","r","D","o","u","W","V","j","_","K","Q","A","R","g","I","9","N","G","p","E","J","3","L","l","4","y","b","7"]'
    );

    function encode(buffer) {

        const map = new Map(baseChars.map((c, i) => [c, customMap[i]]));

        return buffer
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "")
        .split("")
        .map(c => map.get(c) || c)
        .join("");
    }

    const encoded = encode(finalPacket);

    const reversed = Buffer.from(encoded, "ascii").reverse();

    const servers = reversed.toString("hex");

    console.log("\nFinal Hex:", servers);

    /* ------------------ FINAL REQUEST ------------------ */

    const apiUrl =
        `https://vidfast.pro/hezushon/43bba164-137d-537c-8e39-86be4e11ed99/efo/e/APA91V1c6t-xHraulRs44kbQ7VxPjj5YvTYCMgu4bJNg_gWoKNEFKPCil8SQ5zK3T8EMrBQPsogUpMN1We8xcBXhx6K6hJKiGZFng7ZKBc74j-YFpuWWe65h8cv0858a6pxKMWtu9xmYhFzReNuXw4vzEZ6h_2tLhiLKPyLeueIR6m8MTpvDX1r/Yt5qlWapsjE/${servers}`;

    const csrfToken = "22Xg4bhHnx4uUolyJWs7rdNBbIzYVz8z";

    fetch(apiUrl, {
        method: "GET",
        headers: { "X-CSRF-Token": csrfToken }
    })
    .then(res => res.text())
    .then(data => console.log("Response:", data))
    .catch(err => console.error("Error:", err));
}

main();
