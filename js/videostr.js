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

    const result = decryptJs(encrypted, nonce, secret);
    return ContentService
    .createTextOutput(result)
    .setMimeType(ContentService.MimeType.TEXT);
}

/* Main Logic Starts */
const ColumnarTranspositionCipher = (text, key) => {
    const cols = key.length;
    const rows = Math.ceil(text.length / cols);

    const grid = Array.from({
        length: rows
    }, () => Array(cols).fill(''));

    const columnOrder = key
    .split('')
    .map((char, idx) => ({
        char, idx
    }))
    .sort((a, b) => a.char.localeCompare(b.char));

    let i = 0;
    for (const {
        idx
    } of columnOrder) {
        for (let row = 0; row < rows; row++) {
            grid[row][idx] = text[i++] || '';
        }
    }

    let result = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            result += grid[row][col];
        }
    }

    return result;
}

const deterministicShuffle = (array, key2) => {
    // Exact seed generation
    let seed = [...key2].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xFFFFFFFF, 0);

    // PRNG
    const random = (limit) => {
        seed = (1103515245 * seed + 12345) & 0x7FFFFFFF;
        return seed % limit;
    };

    // Copy array
    const result = [...array];

    // Fisher-Yates Shuffle
    for (let i = result.length - 1; i > 0; i--) {
        const j = random(i + 1);
        [result[i],
            result[j]] = [result[j],
            result[i]];
    }

    return result;
};

// 0, 9, 10, 11,
function decryptJs(encrypted_data, nonce, secret, Q_ = 3) {
    let keyphrase = secret + nonce;
    var decoded_data = Utilities.newBlob(Utilities.base64Decode(encrypted_data)).getDataAsString();

    for (let p_ = Q_; p_ >= 1; p_--) {
        let passphrase = keyphrase + p_;

        let seed = passphrase.split('').reduce((acc, char) => {
            return (acc * 31 + char.charCodeAt(0)) & 0xffffffff;
        }, 0);

        const random = (limit) => {
            seed = (1103515245 * seed + 12345) & 0x7fffffff;
            return seed % limit;
        };

        decoded_data = decoded_data.split('').map(char => {
            const idx = charset.indexOf(char);
            if (idx === -1) return char;
            const offset = random(95);
            return charset[(idx - offset + 95) % 95];
        }).join('');

        decoded_data = ColumnarTranspositionCipher(decoded_data,
            passphrase);

        const shuffled = deterministicShuffle(charset,
            passphrase);
        const mapping = {};
        shuffled.forEach((char, idx) => {
            mapping[char] = charset[idx];
        });

        decoded_data = decoded_data.split('').map(c => mapping[c] || c).join('');
    }

    return decoded_data;
}
