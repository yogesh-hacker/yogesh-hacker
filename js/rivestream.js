if (void 0 === A || r.includes("VideoProvider") || r.includes("Torrent") || r.includes("aiRecommendation") || r.includes("manga") || r.includes("liveSports") || "client" !== T) {
    if (void 0 !== A)
        try {
        let e = function(e) {
            if (void 0 === e)
                return "rive";
            try {
                let t,
                n;
                let r = String(e);
                if (isNaN(Number(e))) {
                    let e = r.split("").reduce((e, t)=>e + t.charCodeAt(0), 0);
                    t = c[e % c.length] || btoa(r),
                    n = Math.floor(e % r.length / 2)
                } else {
                    let i = Number(e);
                    t = c[i % c.length] || btoa(r),
                    n = Math.floor(i % r.length / 2)
                }
                let i = r.slice(0, n) + t + r.slice(n),
                o = function(e) {
                    let t = String(e),
                    n = 3735928559 ^ t.length;
                    for (let e = 0; e < t.length; e++) {
                        let r = t.charCodeAt(e);
                        r ^= (131 * e + 89 ^ r << e % 5) & 255,
                        n = (n << 7 | n >>> 25) >>> 0 ^ r;
                        let i = (65535 & n) * 60205,
                        o = (n >>> 16) * 60205 << 16;
                        n = i + o >>> 0,
                        n ^= n >>> 11
                    }
                    return n ^= n >>> 15,
                    n = (65535 & n) * 49842 + ((n >>> 16) * 49842 << 16) >>> 0,
                    n ^= n >>> 13,
                    n = (65535 & n) * 40503 + ((n >>> 16) * 40503 << 16) >>> 0,
                    n ^= n >>> 16,
                    n = (65535 & n) * 10196 + ((n >>> 16) * 10196 << 16) >>> 0,
                    (n ^= n >>> 15).toString(16).padStart(8, "0")
                }(function(e) {
                        e = String(e);
                        let t = 0;
                        for (let n = 0; n < e.length; n++) {
                            let r = e.charCodeAt(n),
                            i = ((t = r + (t << 6) + (t << 16) - t >>> 0) << n % 5 | t >>> 32 - n % 5) >>> 0;
                            t ^= (i ^ (r << n % 7 | r >>> 8 - n % 7)) >>> 0,
                            t = t + (t >>> 11 ^ t << 3) >>> 0
                        }
                        return t ^= t >>> 15,
                        t = (65535 & t) * 49842 + (((t >>> 16) * 49842 & 65535) << 16) >>> 0,
                        t ^= t >>> 13,
                        t = (65535 & t) * 40503 + (((t >>> 16) * 40503 & 65535) << 16) >>> 0,
                        (t ^= t >>> 16).toString(16).padStart(8, "0")
                    }(i));
                return btoa(o)
            } catch (e) {
                return "topSecret"
            }
        }(s || v || void 0), t = A + "&secretKey=".concat(e) + "&proxyMode=".concat(x), n = await fetch(t,
            {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            }), r = await n.json();
        return (null == r ? void 0: r.success) !== !1 && i(A,
            r),
        await r
    } catch (e) {
        console.error("Error fetching data:",
            e)
    }
}
