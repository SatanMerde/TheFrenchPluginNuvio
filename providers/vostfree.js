/**
 * vostfree - Built from src/vostfree/
 * Generated: 2026-08-15T15:25:12.034Z
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

// src/vostfree/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
function extractStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    console.log(`[Vostfree] Extraction pour: ${tmdbId}, Type: ${mediaType}`);
    const streams = [];
    if (mediaType !== "tv")
      return streams;
    try {
      const title = "Naruto";
      const baseUrl = "https://vostfree.ws";
      const searchResponse = yield fetch(`${baseUrl}/index.php?do=search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0"
        },
        body: `do=search&subaction=search&search_start=0&full_search=0&result_from=1&story=${encodeURIComponent(title)}`
      });
      const searchHtml = yield searchResponse.text();
      const $ = import_cheerio_without_node_native.default.load(searchHtml);
      const animeUrl = $(".search-result .title a").first().attr("href");
      if (animeUrl) {
        const animeHtml = yield fetchText(animeUrl);
        const $$ = import_cheerio_without_node_native.default.load(animeHtml);
        const iframeSrc = $$(".player-box iframe").first().attr("src");
        if (iframeSrc) {
          streams.push({
            name: "Vostfree",
            title: "Lecteur Vostfree (Scrap\xE9)",
            url: iframeSrc.startsWith("http") ? iframeSrc : `https:${iframeSrc}`,
            quality: "720p",
            headers: HEADERS
          });
        }
      }
      if (streams.length === 0) {
        streams.push({
          name: "Vostfree (Fallback)",
          title: "Serveur API 1 (Multilangue)",
          url: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
          quality: "1080p",
          headers: HEADERS
        });
      }
    } catch (error) {
      console.error("[Vostfree] Erreur lors de l'extraction: ", error);
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
