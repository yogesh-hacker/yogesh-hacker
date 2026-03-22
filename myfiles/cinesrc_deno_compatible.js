import crypto from "node:crypto";

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
const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" }});

// ======================
// Generate Telemetry
// ======================
async function generateTelemetryPayload(token) {
    if (!token || typeof token !== "string") {
        console.log(token)
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
    console.log(payload);

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
        // 1. Convert the PEM string to a binary DER format (ArrayBuffer)
    const pemContents = RSA_PUBLIC_KEY
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\s+/g, "");
    const binaryDer = Buffer.from(pemContents, "base64");

    // 2. Import the key natively
    const importedPublicKey = await globalThis.crypto.subtle.importKey(
        "spki",
        binaryDer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );

    // 3. Encrypt the AES key
    const encryptedKeyBuffer = await globalThis.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        importedPublicKey,
        aesKey
    );
    const encryptedKey = Buffer.from(encryptedKeyBuffer);

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
Deno.serve(async req => {
    try {
        const res = await fetch(`${BASE}/api/signature`, {
            headers: {
                "User-Agent": USER_AGENT
            }
        });
        const data = await res.json();
        console.log(data);
        const telemetry = await generateTelemetryPayload(data.token);

        const payload = [
            ID,
            TYPE,
            "$undefined",
            "$undefined",
            telemetry,
            SERVER
        ];
        console.log(payload);

        const embedRes = await fetch(EMBED, {
            method: "POST",
            headers: {
                "Referer": BASE,
                "User-Agent": USER_AGENT,
                "next-action": NEXT_ACTION
            },
            body: JSON.stringify(payload)
        });
        const raw = await embedRes.text();
        console.log(raw);
        const cleaned = raw.split("\n")[1].slice(2).replace(/^"|"$/g, "");
        const result = await decrypt(cleaned);

        // Final output
        console.log(result);

        return jsonResponse({ result });
    } catch (e) {
        console.error("Error:", e);
        return jsonResponse({
            error: e.message || e
        }, 500);
    }
}, {
    port: 8000
});

console.log("Server running at http://localhost:8000");
