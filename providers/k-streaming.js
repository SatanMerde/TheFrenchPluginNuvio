/**
 * k-streaming - Built from src/k-streaming/
 * Generated: 2026-08-15T15:36:12.657Z
 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/k-streaming/http.js
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"
  // Add other common headers like 'Referer' if needed
};

// src/k-streaming/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
function getQualityScore(qualityStr) {
  const q = (qualityStr || "").toLowerCase();
  if (q.includes("4k") || q.includes("2160"))
    return 4e3;
  if (q.includes("1440") || q.includes("2k"))
    return 2e3;
  if (q.includes("1080") || q.includes("fhd"))
    return 1080;
  if (q.includes("720") || q.includes("hd"))
    return 720;
  if (q.includes("480") || q.includes("sd"))
    return 480;
  if (q.includes("360") || q.includes("320"))
    return 360;
  return 500;
}
function getLanguageScore(langStr) {
  const l = (langStr || "").toUpperCase();
  if (l.includes("VF") && !l.includes("VOSTFR"))
    return 1e4;
  if (l.includes("MULTI"))
    return 8e3;
  if (l.includes("VOSTFR"))
    return 4e3;
  return 1e3;
}
function sortStreamsByPriority(streams) {
  return streams.sort((a, b) => {
    const scoreA = getLanguageScore(a.title) + getQualityScore(a.quality || a.title);
    const scoreB = getLanguageScore(b.title) + getQualityScore(b.quality || b.title);
    return scoreB - scoreA;
  });
}
function extractStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    if (!tmdbId)
      return [];
    const supportedTypes = ["movie", "tv"];
    if (!supportedTypes.includes(mediaType)) {
      return [];
    }
    console.log(`[${config.name}] Recherche de flux pour: ${tmdbId} (${mediaType})`);
    let streams = [];
    try {
      let baseUrl = "";
      if (mediaType === "movie") {
        baseUrl = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      } else if (mediaType === "tv") {
        const s = season || 1;
        const e = episode || 1;
        baseUrl = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}`;
      }
      if (baseUrl) {
        streams.push({
          name: "K-Streaming",
          title: "\u{1F1EB}\u{1F1F7} VF \u2022 1080p Full HD",
          url: baseUrl,
          quality: "1080p",
          headers: HEADERS
        });
        streams.push({
          name: "K-Streaming",
          title: "\u{1F1EB}\u{1F1F7} MULTI (VF/VOSTFR) \u2022 720p HD",
          url: baseUrl,
          quality: "720p",
          headers: HEADERS
        });
      }
      streams = sortStreamsByPriority(streams);
    } catch (error) {
      console.error(`[${config.name}] Erreur lors de l'extraction: `, error.message);
      return [];
    }
    return streams;
  });
}

// src/k-streaming/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[K-Streaming] Request: ${mediaType} ${tmdbId}`);
      const streams = yield extractStreams(tmdbId, mediaType, season, episode);
      return streams;
    } catch (error) {
      console.error(`[K-Streaming] Error: ${error.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
