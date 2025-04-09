const forge = require('node-forge');
const axios = require('axios');

// Basic setup
const base_url = "https://raretoonsindia.co/v/zecLyCAzldEL/";
const headers = {
    "Origin": "https://raretoonsindia.co/",
    "Referer": "https://raretoonsindia.co/",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
};

// Console colors
const Colors = {
    okgreen: '\x1b[32m',
    endc: '\x1b[0m',
    warning: '\x1b[33m',
    okcyan: '\x1b[36m'
};

// Generate DH keys
const dhModulus = BigInt('0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA237327FFFFFFFFFFFFFFFF'); // RFC3526 Group 5
const generator = 2n;
const keyBytes = Math.ceil(256 / 8);
const clientPrivateKey = BigInt('0x' + forge.util.bytesToHex(forge.random.getBytesSync(keyBytes))) % dhModulus;
const clientPublicKey = modExp(generator, clientPrivateKey, dhModulus);

// Generate a unique nonce
const getNonce = () => {
    const rand = Math.random().toString().split('.')[1];
    return parseInt(rand).toString(36) + Date.now().toString(36);
};

// Decode base64
const b64 = str => forge.util.decode64(str);

// Modular exponentiation (for DH)
function modExp(base, exp, mod) {
    base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
    let result = 1n;
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return result;
}

// Decryption logic
function decodeData(res, serverPubKey) {
    const shared = modExp(serverPubKey, clientPrivateKey, dhModulus);
    const derivedKey = forge.sha256.create().update(shared.toString()).digest().bytes();

    // Decrypt symmetric key
    const realKeyDecipher = forge.cipher.createDecipher('AES-CBC', derivedKey);
    realKeyDecipher.start({
        iv: b64(res.temp_iv)
    });
    realKeyDecipher.update(forge.util.createBuffer(b64(res.encrypted_symmetric_key)));
    if (!realKeyDecipher.finish()) return console.log("Symmetric key decryption failed");
    const symmetricKey = realKeyDecipher.output.bytes();

    // Decrypt final data
    const decipher = forge.cipher.createDecipher('AES-CBC', symmetricKey);
    decipher.start({
        iv: b64(res.iv)
    });
    decipher.update(forge.util.createBuffer(b64(res.encrypted_result)));
    decipher.finish();

    // Extract final video URL
    const final = decipher.output.toString();
    const match = final.match(/(?:file\s*:\s*|"file"\s*:\s*)"(https?:\/\/[^"]+)"/);
    const url = match?.[1];

    if (!url) return console.error("No video URL found.");

    // Print video URL + headers
    console.log("\n" + "#".repeat(25) + "\n" + "#".repeat(25));
    console.log(`Captured URL: ${Colors.okgreen}${url}${Colors.endc}`);
    console.log("#".repeat(25) + "\n" + "#".repeat(25));
    console.log(`${Colors.warning}Use these headers to access the URL:${Colors.endc}`);
    for (const [k, v] of Object.entries(headers))
        console.log(`${Colors.okcyan}${k}:${Colors.endc} ${v}`);
    console.log("\n")
}

// Main flow
(async () => {
    const nonce = getNonce();

    // Step 1: Get encrypted_data from main page
    let res = await axios.get(base_url, {
        headers
    });
    const encMatch = res.data.match(/(?:const|let|var|window\.\w+)\s+\w*\s*=\s*'(.*?)'/);
    if (!encMatch) return console.log("Encrypted data not found.");
    const encrypted_data = encMatch[1];

    // Step 2: Send DH public key
    res = await axios.post('https://raretoonsindia.co/api-2/prepair-token.php', {
        nonce: getNonce(),
        client_public: clientPublicKey.toString()
    }, {
        headers
    });

    const {
        server_public,
        pre_token,
        csrf_token
    } = res.data;

    // Step 3: Get session token
    res = await axios.post('https://raretoonsindia.co/api-2/create-token.php', {
        nonce,
        pre_token,
        csrf_token
    }, {
        headers
    });
    const sessionToken = res.data.token;

    // Step 4: Final request to get decrypted video
    res = await axios.post('https://raretoonsindia.co/api-2/last-process.php', {
        token: sessionToken,
        nonce: getNonce(),
        initial_nonce: nonce,
        pre_token,
        csrf_token,
        encrypted_data
    }, {
        headers
    });

    // Step 5: Decrypt and extract video URL
    decodeData(res.data, server_public);
})();
