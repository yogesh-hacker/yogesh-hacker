// CineSrc Core Encryption Logic Deobfuscation
// © 2026 Hacker India, PeerlessX, Yogesh Kumar Jamre


async function generateTelemetryPayload(inputToken) {
    // 1. Validate the input parameter
    if (!inputToken || typeof inputToken !== 'string') {
        throw new Error("Invalid input token provided.");
    }

    const currentPath = window.location.pathname;
    const rsaPublicKey = await fetchRsaPublicKey(); // Deobfuscated from aHx.aHM()
    
    // 2. Generate a 12-byte random Initialization Vector (IV) for AES encryption
    const aesIv = new Uint8Array(12);
    crypto.getRandomValues(aesIv);
    
    // 3. Collect Browser Fingerprint Data
    const fingerprint = {
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: navigator.language,
        langs: navigator.languages.join(','),
        pf: navigator.platform,
        cm: navigator.cookieEnabled,
        dpr: window.devicePixelRatio, 
        sw: screen.width,
        sh: screen.height,
        cd: screen.colorDepth,
        cvs: await getCanvasFingerprint(), // Canvas hashing
        wgl: getWebGLFingerprint(),        // WebGL renderer info (e.g., "ANGLE (ARM, Mali-G57...)")
        jit: await getJitPerformanceInfo() // JavaScript Engine performance timing
    };

    // 4. Construct the Main Payload
    const payload = {
        _r: 1.1,                               // Payload version
        _k: new Date().toISOString(),          // Timestamp
        _m: navigator.userAgent,
        _x: generateDynamicHash1(),            // Obfuscated dynamic value
        _q: generateDynamicHash2(),            // Obfuscated dynamic value
        _j: inputToken,                        // The validated input token
        _w: currentPath,                       // User's current page path
        _f: fingerprint                        // The collected browser data
    };

    // 5. Generate a random AES-GCM 256-bit key
    const aesKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true, // extractable
        ['encrypt', 'decrypt']
    );
    const rawAesKeyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', aesKey));

    // 6. Pre-process Payload (XOR Obfuscation)
    const jsonPayload = JSON.stringify(payload);
    const encodedPayload = new TextEncoder().encode(jsonPayload);
    const xorPayload = new Uint8Array(encodedPayload.length);
    
    // XOR the JSON string against the raw bytes of the AES key
    for (let i = 0; i < encodedPayload.length; i++) {
        xorPayload[i] = encodedPayload[i] ^ rawAesKeyBytes[i % rawAesKeyBytes.length];
    }

    // 7. Encrypt the XOR'd Payload with AES-GCM
    const encryptedPayloadBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: aesIv },
        aesKey,
        xorPayload
    );
    const encryptedPayload = new Uint8Array(encryptedPayloadBuffer);

    // 8. Encrypt the AES Key with the Server's RSA Public Key
    const encryptedAesKeyBuffer = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        rsaPublicKey,
        rawAesKeyBytes
    );
    const encryptedAesKey = new Uint8Array(encryptedAesKeyBuffer);

    // 9. Format Final Output string delimited by "~"
    // aHx.aHG functions act as Base64 encoders in the original script
    const finalTokenString = [
        "v1.1",           // temp1(0x28f)
        toBase64(encryptedAesKey), 
        toBase64(aesIv), 
        toBase64(encryptedPayload)
    ].join("~");

    // Returns the final encoded string to be attached to a request
    return encodeBase64(finalTokenString); 
}
  
