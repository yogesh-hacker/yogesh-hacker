/*!
 * Title: Videasy WASM Decryption – Decompiled for Educational Use
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
 * For licensing or authorized usage, please contact:
 * 📧 Email: businesshackerindia@gmail.com
 * 
 * Disclaimer:
 * This code has been decompiled and reformatted purely for
 * educational and research purposes. Unauthorized use will be
 * considered a violation of intellectual property rights.
 */

const CryptoJS = require("crypto-js");

var wasmInstance, compiledModule;
let getWasmInstance = async () => {
    if (!wasmInstance) {
        if (!compiledModule) {
            const fetchedModule = await WebAssembly.compileStreaming(
                fetch("http://player.videasy.net/module.wasm")
            );
            compiledModule = initializeModule(fetchedModule, {
                env: {}
            });
        }
        wasmInstance = await compiledModule;
    }
    return wasmInstance;
};

// Initialize and wrap a WebAssembly module with string interop and custom env functions
async function initializeModule(moduleBytes, options = {}) {
    const imports = {
        env: Object.assign(Object.create(globalThis), options.env || {}, {
            seed: () => 12345678, // A Fixed seed to bypass
            abort(msgPtr, filePtr, line, col) {
                msgPtr = readString(msgPtr >>> 0);
                filePtr = readString(filePtr >>> 0);
                line >>>= 0;
                col >>>= 0;
                (() => {
                    throw Error(`${msgPtr} in ${filePtr}:${line}:${col}`);
                })();
            }
        })
    };

    const {
        exports
    } = await WebAssembly.instantiate(moduleBytes, imports);
    const memory = exports.memory || options.env.memory;

    function readString(ptr) {
        if (!ptr) return null;
        const end = ptr + new Uint32Array(memory.buffer)[(ptr - 4) >>> 2] >>> 1;
        const buffer = new Uint16Array(memory.buffer);
        let start = ptr >>> 1,
        result = "";
        while (end - start > 1024) {
            result += String.fromCharCode(...buffer.subarray(start, start += 1024));
        }
        return result + String.fromCharCode(...buffer.subarray(start, end));
    }

    function writeString(str) {
        if (str == null) return 0;
        const len = str.length;
        const ptr = exports.__new(len << 1, 2) >>> 0;
        const buffer = new Uint16Array(memory.buffer);
        for (let i = 0; i < len; ++i) {
            buffer[(ptr >>> 1) + i] = str.charCodeAt(i);
        }
        return ptr;
    }

    function ensureNotNull() {
        throw TypeError("value must not be null");
    }

    return Object.setPrototypeOf({
        serve: () => readString(exports.serve() >>> 0),
        verify: (str) => {
            str = writeString(str) || ensureNotNull();
            return exports.verify(str) !== 0;
        },
        decrypt: (str, key) => {
            str = writeString(str) || ensureNotNull();
            return readString(exports.decrypt(str, key) >>> 0);
        }
    }, exports);
}

// Fetch encrypted movie data, verify with WASM, decrypt it, and log the result
(async () => {
    const wasm = await getWasmInstance();

    const hashKey = "227e1171fdba83cbaf033127c6272c20900032fd75c9581d49bae12b66810e777d5759fff7f6a872200a2c953b803d6725d5840f600847f981af902670f1d7dd"; // A fixed valid key for fixed seed
    const tmdbId = 1061474;

    const response = await fetch(
        "https://api.videasy.net/1movies/sources-with-title?title=Superman&mediaType=movie&year=2025&episodeId=1&seasonId=1&tmdbId=1061474&imdbId=tt5950044"
    );
    const encryptedText = await response.text();

    wasm.verify(hashKey);
    const decryptedWasm = wasm.decrypt(encryptedText, tmdbId);
    const finalData = CryptoJS.AES.decrypt(decryptedWasm, "").toString(CryptoJS.enc.Utf8);

    console.log(finalData);
})();
