// ==========================================
// --- ULTIMATETOOL UNIFIED EXTRACTION HOOK ---
// ==========================================
(() => {
    // ---------------------------------------------------
    // 1. MASTER STATE & LOGGER
    // ---------------------------------------------------
    const ExtractedConfig = {
        crypto: {
            AES_ENC_KEY: null,
            AES_ENC_IV: null,
            AES_DEC_KEY: null,
            XOR_SEED_KEY: null,
            MAGIC_NUM_1_NONCE: null,
            MAGIC_NUM_2_COUNTER: null
        },
        base64KeyBatches: [] // Will hold objects of { keyPrimary, keySecondary, rc4Key }
    };

    const rawBase64Keys = [];
    let dumpTimeout = null;

    // Unified Error Logger
    function logError(context, err) {
        const errorMsg = `[!] ERROR in ${context}: ${err.message}\nStack: ${err.stack}`;
        if (typeof UltimateLogger !== "undefined") UltimateLogger.log(errorMsg);
        else if (typeof mylogger !== "undefined") mylogger.log(errorMsg);
        else console.error(errorMsg);
    }

    // Real-time individual logger
    function logEvent(msg) {
        if (typeof UltimateLogger !== "undefined") UltimateLogger.log(msg);
        else if (typeof mylogger !== "undefined") mylogger.log(msg);
        else console.log(msg);
    }

    // Master JSON Dumper (Debounced)
    function triggerMasterDump() {
        clearTimeout(dumpTimeout);
        dumpTimeout = setTimeout(() => {
            // Rebuild batches right before dumping to ensure we don't miss trailing keys
            ExtractedConfig.base64KeyBatches = [];
            for (let i = 0; i < rawBase64Keys.length; i += 3) {
                ExtractedConfig.base64KeyBatches.push({
                    keyPrimary:   rawBase64Keys[i]     || null,
                    keySecondary: rawBase64Keys[i + 1] || null,
                    rc4Key:       rawBase64Keys[i + 2] || null
                });
            }

            const jsonOutput = JSON.stringify(ExtractedConfig, null, 4);
            logEvent("\n[!] === COMPLETE EXTRACTED CONFIG ===\n" + jsonOutput + "\n=====================================");
        }, 1500); // Waits 1.5 seconds after activity stops to print the full JSON
    }

    // Expose globally so you can trigger it manually from Android WebView if needed
    window.dumpUltimateToolConfig = triggerMasterDump;

    // ---------------------------------------------------
    // 2. HELPER UTILITIES
    // ---------------------------------------------------
    function toHex(data) {
        if (!data) return "null";
        try {
            const arr = data instanceof Uint8Array ? data : new Uint8Array(data);
            return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch(e) { return "unknown"; }
    }

    function littleEndianToInt(bytes) {
        if (!bytes || bytes.length < 8) return null;
        let num = 0;
        for (let i = 0; i < 8; i++) {
            num += bytes[i] * Math.pow(256, i);
        }
        return num;
    }

    function buffersMatch(a, b) {
        if (!a || !b || a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function looksLikeBase64(str) {
        if (/^[a-z]+$/.test(str)) return false; // Reject pure lowercase words
        return typeof str === "string" &&
               str.length >= 8 && 
               str.length % 4 === 0 &&
               /^[A-Za-z0-9+/]+={0,2}$/.test(str);
    }

    // ---------------------------------------------------
    // 3. BASE64 STRING.REPLACE HOOK
    // ---------------------------------------------------
    const originalReplace = String.prototype.replace;
    String.prototype.replace = function(searchValue, replaceValue) {
        const str = String(this);
        
        try {
            if (looksLikeBase64(str) && searchValue instanceof RegExp && searchValue.source === "\\s+" && searchValue.flags === "g") {
                if (!rawBase64Keys.includes(str)) {
                    rawBase64Keys.push(str);
                    logEvent(`[+] Captured Base64 Key: ${str}`);
                    triggerMasterDump();
                }
            }
        } catch (err) {
            logError("String.replace Hook", err);
        }
        
        return originalReplace.call(this, searchValue, replaceValue);
    };

    // ---------------------------------------------------
    // 4. BUFFER & CRYPTO HOOKS
    // ---------------------------------------------------
    let knownEncIV = null;

    function hookBuffer(TargetBuffer) {
        if (!TargetBuffer || TargetBuffer.__isConcatHooked) return;
        
        const origConcat = TargetBuffer.concat;
        TargetBuffer.concat = function(list, totalLength) {
            if (Array.isArray(list)) {
                try {
                    // Pattern: [randomIV (16), XOR_SEED_KEY (Variable), AES_IV (16)]
                    if (list.length === 3 && list[0].length === 16 && list[2].length === 16 && knownEncIV && buffersMatch(list[2], knownEncIV)) {
                        const xorHex = toHex(list[1]);
                        if (ExtractedConfig.crypto.XOR_SEED_KEY !== xorHex) {
                            ExtractedConfig.crypto.XOR_SEED_KEY = xorHex;
                            logEvent("[+] Captured XOR_SEED_KEY");
                            triggerMasterDump();
                        }
                    }
                    
                    // Pattern: The Decryption Config Fingerprint [32, 8, 8]
                    if (list.length === 3 && list[0].length === 32 && list[1].length === 8 && list[2].length === 8) {
                        const decHex = toHex(list[0]);
                        if (ExtractedConfig.crypto.AES_DEC_KEY !== decHex) {
                            ExtractedConfig.crypto.AES_DEC_KEY = decHex;
                            ExtractedConfig.crypto.MAGIC_NUM_1_NONCE = littleEndianToInt(list[1]);
                            ExtractedConfig.crypto.MAGIC_NUM_2_COUNTER = littleEndianToInt(list[2]);
                            logEvent("[+] Captured AES_DEC_KEY & Magic Numbers");
                            triggerMasterDump();
                        }
                    }
                } catch (err) {
                    logError("Buffer.concat Hook", err);
                }
            }
            return origConcat.apply(this, arguments);
        };
        TargetBuffer.__isConcatHooked = true;
    }

    function hookCrypto(cryptoObj) {
        if (!cryptoObj || cryptoObj.__isCipherHooked) return;

        if (typeof cryptoObj.createCipheriv === "function") {
            const orig = cryptoObj.createCipheriv;
            cryptoObj.createCipheriv = function(algo, key, iv, options) {
                try {
                    const encKeyHex = toHex(key);
                    const encIvHex = toHex(iv);
                    
                    if (ExtractedConfig.crypto.AES_ENC_KEY !== encKeyHex) {
                        ExtractedConfig.crypto.AES_ENC_KEY = encKeyHex;
                        ExtractedConfig.crypto.AES_ENC_IV = encIvHex;
                        knownEncIV = iv; // Save for XOR seed pattern matching
                        logEvent("[+] Captured AES_ENC_KEY & IV");
                        triggerMasterDump();
                    }
                } catch (err) {
                    logError("createCipheriv Hook", err);
                }
                return orig.apply(this, arguments);
            };
        }
        cryptoObj.__isCipherHooked = true;
    }

    // ---------------------------------------------------
    // 5. WEBPACK CHUNK INTERCEPTOR
    // ---------------------------------------------------
    window.webpackChunk_N_E = window.webpackChunk_N_E || [];
    const originalPush = window.webpackChunk_N_E.push;
    
    window.webpackChunk_N_E.push = function(chunkData) {
        try {
            const modules = chunkData[1];
            if (modules) {
                const moduleIds = Object.keys(modules);
                
                for (let i = 0; i < moduleIds.length; i++) {
                    const id = moduleIds[i];
                    const originalModule = modules[id];

                    if (typeof originalModule === 'function') {
                        modules[id] = function(module, exports, __webpack_require__) {
                            const result = originalModule.apply(this, arguments);
                            
                            try {
                                // 1. Check module.exports
                                if (module.exports && module.exports.Buffer) hookBuffer(module.exports.Buffer);
                                if (module.exports && module.exports.createCipheriv) hookCrypto(module.exports);
                                
                                // 2. Check Next.js direct exports (Crucial Fallback)
                                if (exports && exports.Buffer) hookBuffer(exports.Buffer);
                                if (exports && exports.createCipheriv) hookCrypto(exports);
                            } catch (err) {
                                logError(`Webpack Module Intercept (ID: ${id})`, err);
                            }
                            
                            return result;
                        };
                    }
                }
            }
        } catch (err) {
            logError("Webpack Push Hook", err);
        }

        return originalPush.apply(this, arguments);
    };

    logEvent("[+] UltimateTool Unified Hooks Installed Successfully.");
})();
