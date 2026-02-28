/*!
 * Title: Multiembed All Servers API – A Under Development App Script API
 * Author: Yogesh Kumar Jamre (Hacker India)
 * Date: 2026
 * 
 * Copyright (c) 2026 Yogesh Kumar Jamre
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



/**********************
* GLOBAL CONSTANTS
**********************/
const USER_AGENT =
"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36";

const DOMAIN = "https://streamingnow.mov/";
const MULTIEMBED_DEMO = "https://multiembed.mov/?video_id=tt27543632";


/**********************
* UNIVERSAL REQUEST
**********************/
const request = (url, method = "get", payload = null, referer = DOMAIN) =>
UrlFetchApp.fetch(url, {
    method,
    payload,
    headers: {
        Referer: referer,
        "User-Agent": getRandomUserAgent(),
        "X-Requested-With": "XMLHttpRequest"
    },
    followRedirects: true,
    muteHttpExceptions: true
}).getContentText();


/**********************
* EMBED PAGE FETCHER
**********************/
const getEmbedIframe = (videoId, serverId, token) => {
    const html = request(
        `${DOMAIN}playvideo.php?video_id=${videoId}&server_id=${serverId}&token=${token}&init=1`
    );

    const $ = Cheerio.load(html);
    return $("iframe.source-frame.show").attr("src") || null;
};


/**********************
* SCRAPER MAP
**********************/
const scrapers = {

    vip: (id, server, token) => {
        const iframe = getEmbedIframe(id, server, token);
        if (!iframe) return null;

        const page = request(iframe);
        const match = /file:"(https?:\/\/[^"]+)"/.exec(page);

        return {
            name: "VIP Server",
            hls_url: match ? match[1]: null,
            headers: {
                Referer: DOMAIN,
                "User-Agent": USER_AGENT
            }
        };
    },

    vidsrc: (id, server, token) => ({
        server: "VidSrc",
        embed_url: getEmbedIframe(id, server, token)
    }),

    mixdrop: (id, server, token) => ({
        server: "Mixdrop",
        embed_url: getEmbedIframe(id, server, token)
    }),

    dood: (id, server, token) => ({
        server: "Doodstream",
        embed_url: getEmbedIframe(id, server, token)
    }),

    gdrive: (id, server, token) => ({
        server: "Hydrax",
        embed_url: getEmbedIframe(id, server, token)
    }),
    
    vidmoly: (id, server, token) => ({
        server: "Vidmoly",
        embed_url: getEmbedIframe(id, server, token)
    }),
    voe: (id, server, token) => ({
        server: "Voe",
        embed_url: getEmbedIframe(id, server, token)
    }),
    lulustream: (id, server, token) => ({
        server: "Lulu Stream",
        embed_url: getEmbedIframe(id, server, token)
    }),
    filelions: (id, server, token) => ({
        server: "Filelions",
        embed_url: getEmbedIframe(id, server, token)
    }),
    streamwish: (id, server, token) => ({
        server: "Streamwish",
        embed_url: getEmbedIframe(id, server, token)
    }),
    streamtape: (id, server, token) => ({
        server: "Streamtape",
        embed_url: getEmbedIframe(id, server, token)
    })
};


/**********************
* MAIN ENTRY
**********************/
function doGet(e) {
    // Get URL coming from user
    const targetUrl = e.parameter.url;
    

    // STEP 1: Get redirect page
    const page1 = request(targetUrl, "get", null, "https://multiembed.mov/");
    const redirectMatch = /btoa\("https:\/\/(.*?)"\)/.exec(page1);
    const redirectUrl = redirectMatch ? `https://${redirectMatch[1]}`: null;

    if (!redirectUrl) return output({
        error: "Redirect URL not found"
    });

    // STEP 2: Get token
    const page2 = request(
        redirectUrl,
        "post",
        {
            "button-click":
            "ZEhKMVpTLVF0LVBTLVF0LVAtMGs1TFMtUXpPREF0TC0wLVYzTi0wVS1RTi0wQTFORGN6TmprLTU=",
            "button-referer": ""
        },
        "https://multiembed.mov/"
    );

    const tokenMatch = /load_sources\("(.*?)"\)/.exec(page2);
    const token = tokenMatch ? tokenMatch[1]: null;

    if (!token) return output({
        error: "Token not found"
    });

    // STEP 3: Get server list
    const serverHtml = request(
        `${DOMAIN}response.php`,
        "post",
        {
            token
        }
    );

    const $ = Cheerio.load(serverHtml);

    const serverList = $("li")
    .map((i, el) => ({
        id: $(el).attr("data-id"),
        server: $(el).attr("data-server"),
        name: $(el).text().trim().split("\n")[0]
    }))
    .get();

    // STEP 4: Process servers automatically
    const streamList = serverList
    .map(server => {
        const key = Object.keys(scrapers).find(k =>
            server.name.toLowerCase().includes(k)
        );
        return key
        ? scrapers[key](server.id, server.server, token): null;
    })
    .filter(Boolean);

    return output(streamList);
}

/**********************
* USER-AGENT GENERATOR HELPER
**********************/
function getRandomUserAgent() {
  const userAgents = [

    // Android Chrome
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",

    // Android Chrome (Oppo style 😉)
    "Mozilla/5.0 (Linux; Android 13; CPH2617) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",

    // iPhone Safari
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",

    // Windows Chrome
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",

    // Windows Edge
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/121.0.0.0",

    // Mac Chrome
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  ];

  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
}


/**********************
* OUTPUT HELPER
**********************/
const output = (data) =>
ContentService
.createTextOutput(JSON.stringify(data))
.setMimeType(ContentService.MimeType.JSON);
