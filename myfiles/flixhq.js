const crypto = require("crypto");
const cheerio = require("cheerio");

const baseHeaders = {
    Referer: "https://flixhqz.com/",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10)"
};

async function getCloudflareLocation() {
    try {
        const res = await fetch("https://cloudflare.com/cdn-cgi/trace");
        const text = await res.text();
        return text.match(/loc=([A-Z]+)/)?.[1] || "US";
    } catch {
        return "US";
    }
}

function generateToken(mediaId, episodeId, serverId, loc) {
    const timestamp = Date.now();
    const payload = `${mediaId}+${episodeId}+${serverId}+${loc}+${timestamp}`;

    const key = crypto.createHash("sha256").update(loc).digest();
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([
        cipher.update(payload, "utf8"),
        cipher.final()
    ]);

    const data = Buffer.concat([
        iv,
        encrypted,
        cipher.getAuthTag()
    ]);

    return Buffer.from(data.toString("base64"))
        .toString("base64")
        .replace(/=/g, "");
}

const getEmbedUrls = async (pageUrl) => {
    const res = await fetch(pageUrl, {
        headers: baseHeaders
    });

    const html = await res.text();

    const embedMatch = html.match(/const\s*plyURL\s*=\s*"(.*?)"/);
    if (!embedMatch) {
        console.log("No plyURL found");
        return [];
    }

    const embedDomain = atob(embedMatch[1]);
    const $ = cheerio.load(html);

    const mediaId = $("#mid").attr("data-id");

    const serverIds = $(".server")
        .map((_, el) => $(el).attr("id")?.split("-").pop())
        .get()
        .filter(Boolean);

    const episodeIds = $(".episode")
        .map((_, el) => $(el).attr("id")?.split("-").pop())
        .get()
        .filter(Boolean);

    if (!episodeIds.length) {
        console.log("No episodes found. Using movie mode.");
        episodeIds.push("1");
    }

    const loc = await getCloudflareLocation();
    const embedUrls = [];

    for (const episodeId of episodeIds) {
        for (const serverId of serverIds) {
            const token = generateToken(
                mediaId,
                episodeId,
                serverId,
                loc
            );

            embedUrls.push({
                episode: episodeId,
                server: serverId,
                url: `${embedDomain}/watch/?v${serverId}${episodeId}#${token}`
            });
        }
    }

    console.log(`Generated ${embedUrls.length} embed URLs`);
    return embedUrls;
};

const getEmbedUrlsByTMDB = async (tmdbId, contentType) => {
    const res = await fetch(
        `https://api.themoviedb.org/3/${contentType}/${tmdbId}?api_key=54e00466a09676df57ba51c4ca30b1a6`,
        { headers: baseHeaders }
    );

    if (!res.ok) {
        throw new Error(`TMDB API error: ${res.status}`);
    }

    const mediaInfo = await res.json();
    const title = mediaInfo.title || mediaInfo.name;

    const searchRes = await fetch(
        `https://flixhqz.com/searching?q=${encodeURIComponent(title)}&limit=24&offset=0`,
        { headers: baseHeaders }
    );

    const searchData = await searchRes.json();

    if (!searchData.data?.length) {
        console.log("No sources available for this media");
        return [];
    }

    for (const media of searchData.data) {
        if (media.t === title) {
            return getEmbedUrls(
                `https://flixhqz.com/movie/${media.s}`
            );
        }
    }

    return [];
};

async function main() {
    const embedUrls = await getEmbedUrlsByTMDB(
        "1010581",
        "movie"
    );

    console.log(embedUrls);
}

main().catch(console.error);
