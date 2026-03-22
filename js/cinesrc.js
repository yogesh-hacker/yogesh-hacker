/*!
 * Cinesrc Encryption Pipeline & Stream URL Scraper – Deobfuscation
 * Author: Yogesh Kumar Jamre (Hacker India)
 * Year: 2026
 *
 * This project focuses on the reverse engineering, analysis,
 * and deobfuscation of the Cinesrc encryption pipeline,
 * including secure extraction of streaming URLs.
 *
 * It demonstrates how encrypted payloads, token generation,
 * and stream delivery mechanisms are processed internally,
 * strictly for educational and research purposes.
 *
 * Copyright (c) 2026 Yogesh Kumar Jamre. All rights reserved.
 * Redistribution, reuse, modification, or integration of this code,
 * in part or whole, without proper credit or written permission
 * from the author is strictly prohibited.
 *
 * If this work is used in any project, research, or publication,
 * proper attribution to the original author must be provided.
 * Unauthorized usage without credit may result in legal action.
 *
 * This project does NOT promote piracy or illegal streaming.
 * It is intended only for security research, learning,
 * and understanding obfuscation/encryption techniques.
 *
 * Special thanks to the reverse engineering community
 * and contributors who share knowledge about
 * JavaScript VM protection and encryption pipelines.
 *
 * Contact: businesshackerindia@gmail.com
 */

const crypto = require("crypto");

// ======================
// Constants
// ======================
const BASE = "https://cinesrc.st";
const USER_AGENT = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const NEXT_ACTION = "7e170c9067504bd743795f8c4d938925469d8ff269";

const SERVER = "nebula";
const TYPE = "movie";
const ID = "1084242";
const EMBED = `${BASE}/embed/${TYPE}/${ID}`;

const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFplzWaLwhwOrmKuhe6Vghq4RU
NBjis9AUEl9Vw6r3CHz8aQGncnNgQ0t1oChO7I7EVs2oKcOrBNfhg+8aP4gURUoU
Xuk9M8M7OdeVvB2rTxiYIX+mvoslyTuAVRTWTvL5qQu9tZ84PfBCd6vFxku20TmF
MYYm2zpuXzCI4mmBewIDAQAB
-----END PUBLIC KEY-----`;

// ======================
// Helpers
// ======================
const toBase64 = (data) => Buffer.from(data).toString("base64");
const fromBase64 = (b64) => Buffer.from(b64, "base64");

// ======================
// Generate Telemetry
// ======================
async function generateTelemetryPayload(token) {
    if (!token || typeof token !== "string") {
        throw new Error("Invalid token");
    }

    const ts = new Date().toISOString();
    const path = new URL(EMBED).pathname;

    const nonce = crypto.randomBytes(16);
    const salt = crypto.randomBytes(16);
    const aesKey = crypto.randomBytes(32);
    const aesIv = crypto.randomBytes(12);

    const fingerprint = {
        tz: "Asia/Calcutta",
        lang: "en-GB",
        langs: "en-GB,en-US,en",
        pf: "Linux armv81",
        cm: true,
        dpr: 2,
        sw: 360,
        sh: 806,
        cd: 24,
        cvs: "6398717e3beb0e320556d5fb2077d04aaae6041ca9f2e8e6a2e912a156849ee1",
        wgl: "ANGLE (ARM, Mali-G57 MC2, OpenGL ES 3.2)|Google Inc. (ARM)",
        jit: "0.5999999046325684,0.9000000953674316,0.9000000953674316,0.5999999046325684,0.2999997138977051"
    };

    const payload = {
        _r: 1.1,
        _k: ts,
        _m: USER_AGENT,
        _n1l: "i3Dguw==",
        _x: nonce.toString("base64"),
        _q: salt.toString("base64"),
        _j: token,
        _n25: "mtD6yA==",
        _w: path,
        _f: fingerprint
    };

    // Flatten payload
    const payloadArray = [];
    for (const key in payload) {
        payloadArray.push(key, payload[key]);
    }

    // XOR encoding
    const encoded = new TextEncoder().encode(JSON.stringify(payloadArray));
    const xored = new Uint8Array(encoded.length);
    for (let i = 0; i < encoded.length; i++) {
        xored[i] = encoded[i] ^ aesKey[i % aesKey.length];
    }

    // AES-256-GCM encryption
    const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, aesIv);
    const encrypted = Buffer.concat([cipher.update(xored), cipher.final()]);
    const tag = cipher.getAuthTag();
    const finalCipher = Buffer.concat([encrypted, tag]);

    // RSA encrypt AES key
    const encryptedKey = crypto.publicEncrypt({
        key: RSA_PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
    }, aesKey);

    return [
        "v1.1",
        toBase64(encryptedKey),
        toBase64(aesIv),
        toBase64(finalCipher)
    ].join("~");
}

// ======================
// Decrypt Response
// ======================
async function decrypt(payload) {
    const [, aesIvb64, ciphertextb64] = payload.split(".");

    const aesIv = fromBase64(aesIvb64);
    const ciphertext = fromBase64(ciphertextb64);
    const aesKey = fromBase64("JWmlRlgGKC3MLQihZMqx/hW276z1FolQ8QRePYWhn/E=");

    const data = ciphertext.subarray(0, -16);
    const authTag = ciphertext.subarray(-16);

    const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, aesIv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}

// ======================
// Main Flow
// ======================
async function main() {
    const res = await fetch(`${BASE}/api/signature`, {
        headers: { "User-Agent": USER_AGENT }
    });

    const { token } = await res.json();
    const telemetry = await generateTelemetryPayload(token);

    const payload = [
        ID,
        TYPE,
        "$undefined",
        "$undefined",
        telemetry,
        SERVER
    ];

    const embedRes = await fetch(EMBED, {
        method: "POST",
        headers: {
            "User-Agent": USER_AGENT,
            "Next-Action": NEXT_ACTION
        },
        body: JSON.stringify(payload)
    });

    const raw = await embedRes.text();
    const cleaned = raw.split("\n")[1].slice(2).replace(/^"|"$/g, "");
    const result = await decrypt(cleaned);

    // Final output
    console.log(result);
}

main();
