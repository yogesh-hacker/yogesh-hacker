/*!
 * Title: AnimeKai Token Generator – Decompiled for Educational Use
 * Author: Yogesh Kumar Jamre (Hacker India)
 * Date: 2025
 * 
 * Copyright (c) 2025 Yogesh Kumar Jamre
 * 
 * This source code is protected and proprietary.
 * Redistribution, modification, usage, or integration of this code,
 * in part or whole, is strictly prohibited without the explicit
 * written permission of the author.
 * 
 * If you wish to use this code, please contact:
 * 📧 Email: businesshackerindia@gmail.com
 * 
 * Unauthorized use will be considered a violation of intellectual property rights.
 */


function generateToken(input) {
    // Step 1
    var input = getCharCodes(input);

    // Step 2
    input = encryptCharCodes(input, 'Wvhzop8MnHahW7cDTlViY3tE94Eh3yWtqJciPBdyW+M=');
    input = transformation1(input);

    // Step 3
    input = encryptCharCodes(input, 'DSATdL+81o2l1n6MQgiQazgSjiHB3OjRLUGD9wappvQ=');
    input = transformation2(input);

    // Step 4
    input = encryptCharCodes(input, 'nSXwpF9D0+yronlxNSMtYnb7TSRnVJbSxCnYWrJvyL4=');
    input = transformation3(input);

    // Step 5
    input = encryptCharCodes(input, 'NLY6ykqBTOARVvnznDPNBrqVyMbU5xMlMhyJ207esSA=');
    input = transformation4(input);

    // Step 6
    input = encryptCharCodes(input, 'Z/4f/PqGuqAbF3lqSBgwunsdjyznFjU8PxRFOJ0E6dc=');
    input = transformation5(input);

    // Step 7
    input = fromCharCodeArray(input);

    // Step 8
    input = base64UrlEncode(input);
    return input
}

// Returns a char code array from a string
function getCharCodes(input) {
    return input.split('').map(char => char.charCodeAt(0));
}

// Encrypts a char code array with a key using RC4(Symmetric)
function encryptCharCodes(input, base64Key) {
    const key = atob(base64Key);
    const plaintext = fromCharCodeArray(input)
    const encrypted = rc4(key, plaintext);
    return getCharCodes(encrypted)
}

// Returns a string from a char code array
function fromCharCodeArray(charCodes) {
    return String.fromCharCode(...charCodes);
}

// Returns a URL-safe base64 encoded string
function base64UrlEncode(input) {
    const base64 = btoa(input);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Encrypts a string using a key, RC4(Symmetric)
function rc4(key, text) {
    const s = [];
    let j = 0;
    let result = '';

    // Key-scheduling algorithm (KSA)
    for (let i = 0; i < 256; i++) {
        s[i] = i;
    }

    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        [s[i],
            s[j]] = [s[j],
            s[i]]; // Swap
    }

    // Pseudo-random generation algorithm (PRGA)
    let i = 0;
    j = 0;
    for (let y = 0; y < text.length; y++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        [s[i],
            s[j]] = [s[j],
            s[i]]; // Swap again
        const k = s[(s[i] + s[j]) % 256];
        result += String.fromCharCode(text.charCodeAt(y) ^ k);
    }

    return result;
}


// Custom XOR-based byte transformation
function transformation1(text) {
    keyPrimary = atob("990IpR3/xf/fQcNsX7YIEBcwbiJNKxwU/HREIOUp2fc=");
    keySecondary = atob('yfEyxVI=')
    result = [];
    for (i = 0; i < text.length; i++) {
        i < 5 && result.push(keySecondary.charCodeAt(i));
        byte = text[i];
        byte = byte ^ keyPrimary.charCodeAt(i % 32);
        switch (i % 10) {
            case 0:
                byte = (byte >>> 6 | byte << 2) & 255 // p
                break;
            case 1:
                byte = (byte >>> 4 | byte << 4) & 255 // P
                break;
            case 2:
                byte = (byte >>> 5 | byte << 3) & 255 // xt
                break;
            case 3:
                byte = byte ^ 194; // q
                break;
            case 4:
                byte = (byte >>> 5 | byte << 3) & 255; // T
                break;
            case 5:
                byte = (byte >>> 3 | byte << 5) & 255 // C
                break;
            case 6:
                byte = byte ^ 234; // m
                break;
            case 7:
                byte = (byte >>> 5 | byte << 3) & 255 // H
                break;
            case 8:
                byte = (byte >>> 5 | byte << 3) & 255 // T
                break;
            case 9:
                byte = byte ^ 184; // B
                break
        }
        result.push(byte & 255)
    }
    return result
}

// Custom XOR-based byte transformation
function transformation2(text) {
    keyPrimary = atob("WI3JL0v1idqIAyxCkPjz4ZiJP5Jj81AbM/i7VPNOIM8=")
    keySecondary = atob("EbqywmE=");
    result = [];
    for (index = 0; index < text.length; index++) {
        index < 5 && result.push(keySecondary.charCodeAt(index));
        byte = text[index];
        byte = byte ^ keyPrimary.charCodeAt(index % 32);
        switch (index % 10) {
            case 0:
                byte = (byte >>> 3 | byte << 5) & 255 // C
                break;
            case 1:
                byte = byte ^ 184; // B
                break;
            case 2:
                byte = (byte >>> 5 | byte << 3) & 255 // T
                break;
            case 3:
                byte = (byte + 139) % 256; // k
                break;
            case 4:
                byte = byte ^ 194; // q
                break;
            case 5:
                byte = byte ^ 184; // B
                break;
            case 6:
                byte = (byte - 108 + 256) % 256 // ot
                break;
            case 7:
                byte = (byte + 139) % 256; // k
                break;
            case 8:
                byte = (byte >>> 5 | byte << 3) & 255 // T
                break;
            case 9:
                byte = (byte >>> 3 | byte << 5) & 255 // C
                break
        }
        result.push(byte & 255)
    }
    return result
}

// Custom XOR-based byte transformation
function transformation3(text) {
    keyPrimary = atob("cpGojXnxs61ViLIN7En1nrgjRzOrjtJRjhAXLIvprRo=")
    keySecondary = atob("6tHH20jNPt8=");
    result = [];
    for (index = 0; index < text.length; index++) {
        index < 8 && result.push(keySecondary.charCodeAt(index));
        byte = text[index];
        byte = byte ^ keyPrimary.charCodeAt(index % 32);
        switch (index % 10) {
            case 0:
                byte = (byte + 139) % 256; // k
                break;
            case 1:
                byte = (byte >>> 5 | byte << 3) & 255 // H
                break;
            case 2:
                byte = (byte >>> 3 | byte << 5) & 255 // C
                break;
            case 3:
                byte = (byte >>> 5 | byte << 3) & 255 // T
                break;
            case 4:
                byte = (byte >>> 3 | byte << 5) & 255 // C
                break;
            case 5:
                byte = byte ^ 234; // m
                break;
            case 6:
                byte = (byte >>> 6 | byte << 2) & 255 // K
                break;
            case 7:
                byte = byte ^ 194; // q
                break;
            case 8:
                byte = (byte >>> 3 | byte << 5) & 255 // C
                break;
            case 9:
                byte = (byte << 5 | byte >>> 3) & 255 // U
                break
        }
        result.push(byte & 255)
    }
    return result
}

// Custom XOR-based byte transformation
function transformation4(text) {
    keyPrimary = atob("O8zWX1txkbTdmbD5vU3e9g1/unR0dL2QI34aebhn3B8=")
    keySecondary = atob("Xny+PEIU");
    result = [];
    for (index = 0; index < text.length; index++) {
        index < 6 && result.push(keySecondary.charCodeAt(index));
        byte = text[index];
        byte = byte ^ keyPrimary.charCodeAt(index % 32);
        switch (index % 10) {
            case 0:
                byte = byte ^ 184; // B
                break;
            case 1:
                byte = (byte << 5 | byte >>> 3) & 255 // U
                break;
            case 2:
                byte = byte ^ 234; // m
                break;
            case 3:
                byte = (byte >>> 5 | byte << 3) & 255 // xt
                break;
            case 4:
                byte = byte ^ 72 // nt
                break;
            case 5:
                byte = (byte << 5 | byte >>> 3) & 255 // U
                break;
            case 6:
                byte = (byte >>> 5 | byte << 3) & 255 // H
                break;
            case 7:
                byte = (byte << 5 | byte >>> 3) & 255 // U
                break;
            case 8:
                byte = (byte >>> 5 | byte << 3) & 255 // H
                break;
            case 9:
                byte = (byte << 5 | byte >>> 3) & 255 // U
                break
        }
        result.push(byte & 255)
    }
    return result
}

// Custom XOR-based byte transformation
function transformation5(text) {
    keyPrimary = atob("AJjAzvl3j1JXDQ0PlZ9Oz40J0CVMkogtZm3Y4Wzjw04=")
    keySecondary = atob("2C22P9U=");
    result = [];
    for (index = 0; index < text.length; index++) {
        index < 5 && result.push(keySecondary.charCodeAt(index));
        byte = text[index];
        byte = byte ^ keyPrimary.charCodeAt(index % 32);
        switch (index % 10) {
            case 0:
                byte = (byte >>> 4 | byte << 4) & 255 // P
                break;
            case 1:
                byte = (byte >>> 3 | byte << 5) & 255 // C
                break;
            case 2:
                byte = (byte >>> 6 | byte << 2) & 255 // p
                break;
            case 3:
                byte = (byte + 139) % 256; // k
                break;
            case 4:
                byte = (byte >>> 6 | byte << 2) & 255 // p
                break;
            case 5:
                byte = (byte >>> 4 | byte << 4) & 255 // P
                break;
            case 6:
                byte = (byte >>> 6 | byte << 2) & 255 // p
                break;
            case 7:
                byte = (byte >>> 5 | byte << 3) & 255 // H
                break;
            case 8:
                byte = (byte << 5 | byte >>> 3) & 255 // U
                break;
            case 9:
                byte = (byte - 108 + 256) % 256 // ot
                break
        }
        result.push(byte & 255)
    }
    return result
}

var myToken = generateToken('dIe8-A');
console.log(myToken)
