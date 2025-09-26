/*!
 * Title: Hexa and Flixer WASM Decryption – Decompiled for Educational Use
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

// Deno Server
import init, { process_img_data } from './img_data.js';

const APIs = {
  flixer: "https://flixer.su",
  hexa: "https://themoviedb.hexa.watch"
};

// Generate a 64-character random hex
const generateRandomHex = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)))
       .map(b => b.toString(16).padStart(2, '0'))
       .join('');

// Unified JSON response
const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });

// Build TMDB path based on mediaType
const buildPath = (type, id, season, episode) => {
  switch (type) {
    case "movie": return `api/tmdb/movie/${id}/images`;
    case "tv":    return `api/tmdb/tv/${id}/season/${season}/episode/${episode}/images`;
    default: throw new Error("Unknown mediaType");
  }
};

// Init WASM once
await init({ moduleOrPath: 'https://hexa.watch/assets/wasm/img_data_bg.wasm' });

Deno.serve(async req => {
  try {
    const url = new URL(req.url);
    const tmdbId = url.searchParams.get("tmdbId");
    const server = url.searchParams.get("server");
    const mediaType = url.searchParams.get("mediaType");

    if (!tmdbId) return jsonResponse({ error: "tmdbId is required" }, 400);

    const path = buildPath(
      mediaType,
      tmdbId,
      url.searchParams.get("season"),
      url.searchParams.get("episode")
    );

    const apiBase = APIs[server];
    if (!apiBase) throw new Error("Unknown server");

    const key = generateRandomHex();
    const resp = await fetch(`${apiBase}/${path}`, {
      headers: { 'Accept': 'plain/text', 'X-Api-Key': key }
    });

    const text = await resp.text();
    const sources = JSON.parse(await process_img_data(text, key));

    return jsonResponse({ sources });
  } catch (e) {
    console.error("Error:", e);
    return jsonResponse({ error: e.message || e }, 500);
  }
}, { port: 8000 });

console.log("Server running at http://localhost:8000");
