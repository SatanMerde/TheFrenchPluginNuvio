/**
 * french-stream - Built from src/french-stream/
 * Generated: 2026-08-15T15:25:11.975Z
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

// src/french-stream/http.js
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

// src/french-stream/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
function extractStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    console.log(`[French Stream] Extraction pour: ${tmdbId}, Type: ${mediaType}`);
    const streams = [];
    try {
      const baseUrl = "https://french-stream.al";
      const searchQuery = tmdbId;
      const searchUrl = `${baseUrl}/?do=search&subaction=search&story=${encodeURIComponent(searchQuery)}`;
      try {
        const searchHtml = yield fetchText(searchUrl);
        const $ = import_cheerio_without_node_native.default.load(searchHtml);
        const firstResultUrl = $(".short-story .poster a, .film-pack a, .mov-t a").first().attr("href");
        if (firstResultUrl) {
          const movieHtml = yield fetchText(firstResultUrl);
          const $$ = import_cheerio_without_node_native.default.load(movieHtml);
          $$("iframe").each((i, el) => {
            const src = $$(el).attr("src") || $$(el).attr("data-src");
            if (src && !src.includes("google") && !src.includes("ads")) {
              const directUrl = src.startsWith("//") ? `https:${src}` : src;
              streams.push({
                name: "French Stream",
                title: `Lecteur ${i + 1} (VF/VOSTFR)`,
                url: directUrl,
                quality: "1080p",
                headers: HEADERS
              });
            }
          });
        }
      } catch (scrapingErr) {
        console.warn("[French Stream] Le scraping direct a rencontr\xE9 un obstacle:", scrapingErr.message);
      }
      if (streams.length === 0) {
        let fallbackUrl = "";
        if (mediaType === "movie") {
          fallbackUrl = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
        } else if (mediaType === "tv") {
          fallbackUrl = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
        }
        if (fallbackUrl) {
          streams.push({
            name: "French Stream (Serveur 1)",
            title: "Lecteur Streaming (Multi/FR)",
            url: fallbackUrl,
            quality: "1080p",
            headers: HEADERS
          });
        }
      }
    } catch (error) {
      console.error("[French Stream] Erreur globale: ", error);
    }
    return streams;
  });
}

// src/french-stream/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[French Stream] Request: ${mediaType} ${tmdbId}`);
      const streams = yield extractStreams(tmdbId, mediaType, season, episode);
      return streams;
    } catch (error) {
      console.error(`[French Stream] Error: ${error.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
