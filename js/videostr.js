// Last Updated: 21 Jul 2025:18:08(IST)
// Fixed with Latest changes ✅

function doGet(e) {
    return handleRequest(e);
}

function doPost(e) {
    return handleRequest(e);
}

const charset = Array.from({
    length: 95
}, (_, i) => String.fromCharCode(i + 32));
var nonce, secret, encrypted;

function handleRequest(e) {
    nonce = e.parameter.nonce;
    secret = e.parameter.secret;
    encrypted = e.parameter.encrypted_data;

    if (!nonce || !secret || !encrypted) {
        return ContentService.createTextOutput("Missing parameters: nonce, secret, or encrypted_data");
    }

    const result = decrypt(encrypted, secret, nonce);
    return ContentService
    .createTextOutput(result)
    .setMimeType(ContentService.MimeType.TEXT);
}

/* Main Logic Starts */
const ColumnarTranspositionCipher = (P7, p4) => {
    var T1,
    x2,
    B7,
    B$,
    a_,
    m5,
    f5;
    T1 = p4.length;
    x2 = Math.ceil(P7.length / T1);
    B7 = Array(x2).fill().map(() => {
        return Array(T1).fill('');
    });
    B$ = p4.split('').map((Q6, v6) => {
        return (() => {
            var F4 = {};
            F4.char = Q6;
            F4.idx = v6;
            return F4;
        })();
    });
    a_ = [...B$].sort((I_,
        t_) => {
        return I_.char.charCodeAt(0) - t_.char.charCodeAt(0);
    });


    m5 = 0;
    a_.forEach(({
        'idx': F3
    }) => {
        for (var k3 = 0; k3 < x2; k3++) {
            B7[k3][F3] = P7[m5++];
        }
    });
    f5 = '';
    for (var H9 = 0; H9 < x2; H9++) {
        for (var D2 = 0; D2 < T1; D2++) {
            f5 += B7[H9][D2];
        }
    }
    return f5;
}

const deterministicShuffle = (y_, H$) => {
    var a$,
    A5,
    K3,
    c2,
    d7;

    a$ = BigInt("0"); // Google App Script doesn't support native BigInt
    for (var R9 = 0; R9 < H$.length; R9++) {
        a$ = a$ * BigInt("31") + BigInt(H$.charCodeAt(R9)) & BigInt("0xFFFFFFFF");
    }
    A5 = a$;
    K3 = N1 => {
        A5 = A5 * BigInt("1103515245") + BigInt("12345") & BigInt("0x7FFFFFFF")
        return Number(A5 % BigInt(N1));

    };
    c2 = [...y_];
    for (var R5 = c2.length - 1; R5 > 0; R5--) {
        d7 = K3(R5 + 1 * 1);
        [c2[R5],
            c2[d7]] = [c2[d7],
            c2[R5]];
    }
    return c2;

};

const generateKey = (secret, nonce) => {
    var U6,
    h1,
    e6,
    T3,
    L_,
    N7,
    x0,
    p9,
    y8,
    S1,
    u6,
    G9;
    U6 = secret + nonce;
    h1 = BigInt("0");
    e6 = BigInt("47");
    for (var B4 = 0; B4 < U6.length; B4++) {
        T3 = BigInt(U6.charCodeAt(B4));
        h1 = T3 + h1 * e6 + (h1 << BigInt("7")) - h1;
    }
    L_ = h1 < BigInt("0") ? -h1: h1;
    N7 = Number(L_ % BigInt("0x7FFFFFFFFFFFFFFF"));
    x0 = [];
    for (var v_ = 0; v_ < U6.length; v_++) {
        x0.push(String.fromCharCode(U6.charCodeAt(v_) ^ 15835827 & "0xFF" * 1));
    }
    U6 = x0.join('');
    var C0 = 1;
    p9 = N7 % U6.length + ("7" ^ 0);
    U6 = U6.slice(p9) + U6.slice(0, p9);
    y8 = nonce.split('').reverse().join('');
    S1 = ''
    for (var o4 = 0; o4 < Math.max(U6.length, y8.length); o4++) {
        var z4 = 1;
        var G5 = 3;
        S1 += (U6[o4] || '') + (y8[o4] || '');
    }
    u6 = 96 + N7 % 33;
    G9 = S1.substring(0, u6);
    G9 = [...G9].map(y4 => {
        return String.fromCharCode(y4.charCodeAt("0" << 96) % ("95" - 0) + 32);
    }).join('');
    return G9
}

// 0, 9, 10, 11,
function decrypt(encrypted_data, secret, nonce, iterations = 3) {
    const secretKey = generateKey(secret, nonce);
    let decoded = Utilities.newBlob(Utilities.base64Decode(encrypted_data)).getDataAsString();

    const decryptFlow = (round) => {
        const rngState = {
            value: BigInt("0")
        };
        let output = decoded;
        const key = secretKey + round;

        // Pseudo-random generator
        const rng = (modulo) => {
            rngState.value = (rngState.value * BigInt("1103515245") + BigInt("12345")) & BigInt("0x7FFFFFFF");
            return Number(rngState.value % BigInt(modulo));
        };

        // Seed RNG
        for (let i = 0; i < key.length; i++) {
            rngState.value = (rngState.value * BigInt("31") + BigInt(key.charCodeAt(i))) & BigInt("0xFFFFFFFF");
        }

        const hashKey = deterministicShuffle(charset, key);
        output = output.split('').map((char) => {
            const charIndex = charset.indexOf(char);
            if (charIndex === -1) return char;
            const rand = rng(95);
            const decodedIndex = (charIndex - rand + 95) % 95;
            return charset[decodedIndex];
        }).join('');
        output = ColumnarTranspositionCipher(output, key);
        shuffled = deterministicShuffle(charset, key);
        const mapping = {};
        shuffled.forEach((char, idx) => {
            mapping[char] = charset[idx];
        });
        output = output.split('').map(c => mapping[c] || c).join('');
        
        console.log(output)

        decoded = output;
    };

    for (let round = iterations; round >= 1; round--) {
        decryptFlow(round);
    }

    return decoded;
                          }
