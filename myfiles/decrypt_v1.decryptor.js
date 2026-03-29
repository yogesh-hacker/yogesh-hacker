import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../../utils/base_v1.js";
import { fallback_1, fallback_2 } from "../../utils/fallback.js";

// ==========================
// Constants
// ==========================
const USER_AGENT =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36";

// ==========================
// Helpers
// ==========================
const buildHeaders = (referer) => ({
  Accept: "*/*",
  Referer: referer,
  "User-Agent": USER_AGENT,
  "X-Requested-With": "XMLHttpRequest",
});

// Extract nonce from HTML
function extractNonce(html) {
  const match =
    html.match(/\b[a-zA-Z0-9]{48}\b/) ||
    html.match(
      /\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b/
    );

  if (!match) return null;

  // If 3 groups → join them
  return match.length === 4
    ? match[1] + match[2] + match[3]
    : match[0];
}

// ==========================
// Main Function
// ==========================
export async function decryptSources_v1(epID, id, name, type, fallback) {
  try {
    let decryptedSources = null;
    let iframeURL = null;

    // ======================
    // 🔁 FALLBACK FLOW
    // ======================
    if (fallback) {
      const fallbackServer = ["vidsrc", "t-cloud"].includes(
        name.toLowerCase()
      )
        ? fallback_1
        : fallback_2;

      iframeURL = `https://${fallbackServer}/stream/s-2/${epID}/${type}`;

      // Fetch embed page
      const { data: html } = await axios.get(iframeURL, {
        headers: { Referer: `https://${fallbackServer}/` },
      });

      const $ = cheerio.load(html);

      // Extract ID
      const player = $("#megaplay-player");
      const dataId =
        player.attr("data-id") || player.attr("data-ep-id");

      if (!dataId) throw new Error("Missing data-id in fallback");

      // Fetch sources
      const { data } = await axios.get(
        `https://${fallbackServer}/stream/getSources?id=${dataId}`,
        { headers: { "X-Requested-With": "XMLHttpRequest" } }
      );

      decryptedSources = data;
    }

    // ======================
    // 🚀 MAIN FLOW
    // ======================
    else {
      // Step 1: Get episode sources
      const { data: sourcesData } = await axios.get(
        `https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`
      );

      const ajaxLink = sourcesData?.link;
      if (!ajaxLink) throw new Error("Missing ajax link");

      // Step 2: Prepare request
      const { origin } = new URL(ajaxLink);
      const headers = buildHeaders(origin);

      // Step 3: Fetch embed HTML
      const { data: html } = await axios.get(ajaxLink, { headers });
      const $ = cheerio.load(html);

      // Step 4: Extract file ID
      const videoTag = $("#megacloud-player");
      if (!videoTag.length)
        throw new Error("Megacloud player not found");

      const fileId = videoTag.attr("data-id");

      // Step 5: Extract nonce
      const nonce = extractNonce(html);
      if (!nonce) throw new Error("Nonce not found");

      // Step 6: Fetch stream sources
      const { data } = await axios.get(
        `${origin}/embed-2/v3/e-1/getSources?id=${fileId}&_k=${nonce}`,
        { headers }
      );

      decryptedSources = data;
    }

    // ======================
    // 🎯 RESPONSE FORMAT
    // ======================
    return {
      id,
      type,
      server: name,
      iframe: iframeURL,

      link: {
        file: fallback
          ? decryptedSources?.sources?.file ?? ""
          : decryptedSources?.sources?.[0]?.file ?? "",
        type: "hls",
      },

      tracks: decryptedSources?.tracks ?? [],
      intro: decryptedSources?.intro ?? null,
      outro: decryptedSources?.outro ?? null,
    };
  } catch (error) {
    console.error(
      `decryptSources_v1 failed (id=${id}, epID=${epID}, server=${name}) →`,
      error.message
    );
    return null;
  }
}
