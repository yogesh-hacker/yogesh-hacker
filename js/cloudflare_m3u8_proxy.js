export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const target = url.searchParams.get('url');

        if (!target) return new Response('Missing url parameter', {
            status: 400
        });

        const decodedTarget = base64UrlDecode(target);

        const headers = {
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://dostplay.pro/',
        };

        // URL-safe Base64 Encode
        function base64UrlEncode(input) {
            // Convert to Base64
            let base64 = btoa(input); // Browser safe
            // Make it URL safe
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }

        // URL-safe Base64 Decode
        function base64UrlDecode(input) {
            // Pad back to length multiple of 4
            let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            // Decode
            return atob(base64); // Browser safe
        }

        // Helper fetch
        async function fetchResource(url, isText = false) {
            const resp = await fetch(url, {
                headers, redirect: 'follow'
            });
            if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status}`);
            return isText ? await resp.text(): await resp.arrayBuffer();
        }

        try {
            // -------------------- Playlist --------------------
            if (path.startsWith('/m3u8/')) {
                let playlist = await fetchResource(decodedTarget, true);
                const baseUrl = decodedTarget.substring(0, decodedTarget.lastIndexOf('/') + 1);

                // Rewrite EXT-X-KEY URI
                playlist = playlist.replace(
                    /#EXT-X-KEY:METHOD=AES-128,URI="([^"]+)"/g,
                    (match, p1) => {
                        return `#EXT-X-KEY:METHOD=AES-128,URI="/key/?url=${base64UrlEncode(p1)}"`;
                    }
                );

                // Rewrite segment URLs
                playlist = playlist.replace(
                    /((https?:\/\/[^\s"']+\.ts[^\s"']*)|(^|[\s"])([^"\s]+\.ts[^\s"]*))/gm,
                    (match) => {
                        // Clean whitespace if matched as relative
                        match = match.trim();
                        let absoluteUrl = match;

                        // If not http/https, build from base
                        if (!match.startsWith('http')) {
                            absoluteUrl = baseUrl + match;
                        }

                        return `\n/segment/?url=${base64UrlEncode(absoluteUrl)}`;
                    }
                );

                return new Response(playlist,
                    {
                        headers: {
                            'Content-Type': 'application/vnd.apple.mpegurl',
                            'Access-Control-Allow-Origin': '*',
                        },
                    });
            }

            // -------------------- Segment --------------------
            if (path.startsWith('/segment/')) {
                const data = await fetchResource(decodedTarget);
                return new Response(data, {
                    headers: {
                        'Content-Type': 'video/mp2t',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            }

            // -------------------- Key --------------------
            if (path.startsWith('/key/')) {
                const keyData = await fetchResource(decodedTarget);
                return new Response(keyData, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            }

            return new Response('Invalid path', {
                status: 404
            });
        } catch (err) {
            return new Response('Proxy Error: ' + err.message, {
                status: 500
            });
        }
    },
};
