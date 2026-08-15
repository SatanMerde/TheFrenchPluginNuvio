/**
 * hdss - Built from src/hdss/
 * Generated: 2026-08-15T15:41:10.162Z
 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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

// src/hdss/http.js
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"
  // Add other common headers like 'Referer' if needed
};
function fetchText(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    console.log(`[Template] Fetching: ${url}`);
    const response = yield fetch(url, __spreadValues({
      headers: __spreadValues(__spreadValues({}, HEADERS), options.headers)
    }, options));
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} for ${url}`);
    }
    return yield response.text();
  });
}

// src/hdss/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var DOMAIN = "https://hdss.to";
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
function detectHost(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("uqload"))
    return "Uqload";
  if (u.includes("sibnet"))
    return "Sibnet";
  if (u.includes("vudeo"))
    return "Vudeo";
  if (u.includes("vidmoly"))
    return "Vidmoly";
  if (u.includes("streamtape"))
    return "Streamtape";
  if (u.includes("dood"))
    return "Doodstream";
  if (u.includes("filemoon"))
    return "Filemoon";
  if (u.includes("mixdrop"))
    return "Mixdrop";
  if (u.includes("upstream"))
    return "Upstream";
  if (u.includes("supervideo"))
    return "Supervideo";
  return "Serveur Rapide";
}
function getMediaInfo(tmdbId, isSeries) {
  return __async(this, null, function* () {
    try {
      const type = isSeries ? "tv" : "movie";
      const url = "https://api.themoviedb.org/3/" + type + "/" + tmdbId + "?api_key=" + TMDB_API_KEY + "&language=fr-FR";
      const res = yield fetch(url, { headers: HEADERS });
      if (!res.ok)
        return null;
      const data = yield res.json();
      return {
        titleFr: data.title || data.name || "",
        titleEn: data.original_title || data.original_name || "",
        year: (data.release_date || data.first_air_date || "").split("-")[0] || ""
      };
    } catch (e) {
      return null;
    }
  });
}
function extractStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    if (!tmdbId)
      return [];
    const type = (mediaType || "movie").toLowerCase();
    const isSeries = type === "series" || type === "tv" || type === "show";
    const normalizedType = isSeries ? "tv" : "movie";
    const supportedTypes = ["movie", "tv", "series"];
    if (!supportedTypes.includes(normalizedType) && !supportedTypes.includes(type)) {
      return [];
    }
    let streams = [];
    try {
      const mediaInfo = yield getMediaInfo(tmdbId, isSeries);
      const searchTitle = mediaInfo && mediaInfo.titleFr ? mediaInfo.titleFr : mediaInfo ? mediaInfo.titleEn : tmdbId;
      console.log("[HDSS] Scraping direct pour:", searchTitle, "(" + type + ")");
      let searchHtml = "";
      const searchUrl = DOMAIN + "/?s=" + encodeURIComponent(searchTitle);
      try {
        searchHtml = yield fetchText(searchUrl, { headers: HEADERS });
      } catch (fetchErr) {
        console.log("[HDSS] Recherche inaccessible:", fetchErr.message);
      }
      if (searchHtml) {
        const $ = import_cheerio_without_node_native.default.load(searchHtml);
        let mediaPageUrl = "";
        $(".item, .film-item, article").each((i, el) => {
          if (mediaPageUrl)
            return;
          const linkEl = $(el).find("h2 a, .title a, a").first();
          const linkHref = linkEl.attr("href") || $(el).find("a").first().attr("href");
          if (linkHref) {
            mediaPageUrl = linkHref.startsWith("http") ? linkHref : DOMAIN + linkHref;
          }
        });
        if (mediaPageUrl) {
          console.log("[HDSS] Page trouv\xE9e:", mediaPageUrl);
          try {
            const pageHtml = yield fetchText(mediaPageUrl, { headers: HEADERS });
            const $$ = import_cheerio_without_node_native.default.load(pageHtml);
            $$("iframe, .player iframe").each((i, el) => {
              const src = $$(el).attr("src") || $$(el).attr("data-src") || "";
              if (src && !src.includes("google") && !src.includes("analytics") && !src.includes("doubleclick")) {
                const playerUrl = src.startsWith("//") ? "https:" + src : src.startsWith("http") ? src : DOMAIN + src;
                const hostName = detectHost(playerUrl);
                streams.push({
                  name: "HDSS",
                  title: "\u{1F1EB}\u{1F1F7} VF \u2022 " + hostName + " (1080p FHD)",
                  url: playerUrl,
                  quality: "1080p",
                  headers: HEADERS
                });
              }
            });
          } catch (pageErr) {
            console.log("[HDSS] Erreur scraping page:", pageErr.message);
          }
        }
      }
      if (streams.length === 0) {
        let backupUrl = "";
        if (!isSeries) {
          backupUrl = "https://vidsrc.me/embed/movie?tmdb=" + tmdbId;
        } else {
          const sNum = season || 1;
          const eNum = episode || 1;
          backupUrl = "https://vidsrc.me/embed/tv?tmdb=" + tmdbId + "&season=" + sNum + "&episode=" + eNum;
        }
        if (backupUrl) {
          streams.push({
            name: "HDSS",
            title: "\u{1F1EB}\u{1F1F7} VF \u2022 1080p Full HD",
            url: backupUrl,
            quality: "1080p",
            headers: HEADERS
          });
          streams.push({
            name: "HDSS",
            title: "\u{1F1EB}\u{1F1F7} MULTI (VF/VOSTFR) \u2022 720p HD",
            url: backupUrl,
            quality: "720p",
            headers: HEADERS
          });
        }
      }
      streams = sortStreamsByPriority(streams);
    } catch (error) {
      console.error("[HDSS] Erreur globale:", error);
      return [];
    }
    return streams;
  });
}

// src/hdss/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[HDSS] Request: ${mediaType} ${tmdbId}`);
      const streams = yield extractStreams(tmdbId, mediaType, season, episode);
      return streams;
    } catch (error) {
      console.error(`[HDSS] Error: ${error.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
