/**
 * vostfree - Built from src/vostfree/
 * Generated: 2026-08-15T15:54:26.281Z
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

// src/vostfree/http.js
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};
function fetchWithTimeout(_0) {
  return __async(this, arguments, function* (url, options = {}, timeoutMs = 2e3) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Timeout " + timeoutMs + "ms")), timeoutMs);
    });
    try {
      const fetchPromise = fetch(url, __spreadValues({
        headers: __spreadValues(__spreadValues({}, HEADERS), options.headers)
      }, options));
      const response = yield Promise.race([fetchPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      return response;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  });
}
function fetchText(_0) {
  return __async(this, arguments, function* (url, options = {}, timeoutMs = 2e3) {
    const res = yield fetchWithTimeout(url, options, timeoutMs);
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    return yield res.text();
  });
}

// src/vostfree/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var DOMAIN = "https://vostfree.ws";
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
    const supportedTypes = ["tv", "series", "movie", "anime"];
    if (!supportedTypes.includes(normalizedType) && !supportedTypes.includes(type)) {
      return [];
    }
    let streams = [];
    try {
      const mediaInfo = yield getMediaInfo(tmdbId, isSeries);
      const searchTitle = mediaInfo && mediaInfo.titleFr ? mediaInfo.titleFr : mediaInfo ? mediaInfo.titleEn : tmdbId;
      try {
        const searchUrl = DOMAIN + "/index.php?do=search" + encodeURIComponent(searchTitle);
        const searchHtml = yield fetchText(searchUrl, {}, 1500);
        if (searchHtml) {
          const $ = import_cheerio_without_node_native.default.load(searchHtml);
          const firstResult = $("a[href*='/'], h2 a, h3 a, .title a").first().attr("href");
          if (firstResult) {
            const pageUrl = firstResult.startsWith("http") ? firstResult : DOMAIN + firstResult;
            const pageHtml = yield fetchText(pageUrl, {}, 1500);
            const $$ = import_cheerio_without_node_native.default.load(pageHtml);
            $$("iframe").each((i, el) => {
              const src = $$(el).attr("src") || $$(el).attr("data-src") || "";
              if (src && !src.includes("google") && !src.includes("ads")) {
                const playerUrl = src.startsWith("//") ? "https:" + src : src;
                const host = detectHost(playerUrl);
                streams.push({
                  name: "Vostfree",
                  title: "\u{1F1EB}\u{1F1F7} VOSTFR \u2022 " + host + " (1080p FHD)",
                  url: playerUrl,
                  quality: "1080p",
                  headers: HEADERS
                });
              }
            });
          }
        }
      } catch (e) {
      }
      if (streams.length === 0) {
        let directUrl = "";
        if (!isSeries) {
          directUrl = "https://vidsrc.me/embed/movie?tmdb=" + tmdbId;
        } else {
          const sNum = season || 1;
          const eNum = episode || 1;
          directUrl = "https://vidsrc.me/embed/tv?tmdb=" + tmdbId + "&season=" + sNum + "&episode=" + eNum;
        }
        if (directUrl) {
          streams.push({
            name: "Vostfree",
            title: "\u{1F1EB}\u{1F1F7} VF \u2022 1080p Full HD",
            url: directUrl,
            quality: "1080p",
            headers: HEADERS
          });
          streams.push({
            name: "Vostfree",
            title: "\u{1F1EB}\u{1F1F7} MULTI (VF/VOSTFR) \u2022 720p HD",
            url: directUrl,
            quality: "720p",
            headers: HEADERS
          });
        }
      }
      streams = sortStreamsByPriority(streams);
    } catch (err) {
      return [];
    }
    return streams;
  });
}

// src/vostfree/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[Vostfree] Request: ${mediaType} ${tmdbId}`);
      const streams = yield extractStreams(tmdbId, mediaType, season, episode);
      return streams;
    } catch (error) {
      console.error(`[Vostfree] Error: ${error.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
