/**
 * hdss - Built from src/hdss/
 * Generated: 2026-08-15T15:20:38.817Z
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

// src/hdss/http.js
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"
  // Add other common headers like 'Referer' if needed
};

// src/hdss/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
function extractStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    console.log(`Extraction pour: ${tmdbId}, Type: ${mediaType}`);
    const streams = [];
    try {
      const searchQuery = tmdbId;
      const searchUrl = `https://example-streaming-site.com/search?q=${searchQuery}`;
      let videoUrl = "";
      if (mediaType === "movie") {
        videoUrl = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      } else if (mediaType === "tv") {
        videoUrl = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      if (videoUrl) {
        streams.push({
          name: "HDSS",
          title: "Serveur API 1 (Multilangue)",
          url: videoUrl,
          quality: "1080p",
          headers: HEADERS
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction: ", error);
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
