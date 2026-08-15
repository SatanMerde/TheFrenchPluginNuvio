/**
 * filmstoon - Built from src/filmstoon/
 * Generated: 2026-08-15T16:18:39.015Z
 */
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

// src/filmstoon/http.js
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};

// src/filmstoon/extractor.js
function extractStreams(param1, param2, param3, param4) {
  return __async(this, null, function* () {
    let id = "";
    let type = "movie";
    let season = 1;
    let episode = 1;
    if (typeof param1 === "object" && param1 !== null) {
      id = param1.tmdbId || param1.id || param1.imdbId || "";
      type = param1.mediaType || param1.type || "movie";
      season = param1.season || param1.seasonNum || 1;
      episode = param1.episode || param1.episodeNum || 1;
    } else {
      id = String(param1 || "");
      type = String(param2 || "movie");
      season = Number(param3) || 1;
      episode = Number(param4) || 1;
    }
    if (!id || id === "undefined")
      return [];
    const normType = type.toLowerCase();
    const isTv = normType === "tv" || normType === "series" || normType === "show";
    const streams = [];
    const url1 = isTv ? "https://vidsrc.me/embed/tv?tmdb=" + id + "&season=" + season + "&episode=" + episode : "https://vidsrc.me/embed/movie?tmdb=" + id;
    const url2 = isTv ? "https://vidsrc.to/embed/tv/" + id + "/" + season + "/" + episode : "https://vidsrc.to/embed/movie/" + id;
    const url3 = isTv ? "https://embed.su/embed/tv/" + id + "/" + season + "/" + episode : "https://embed.su/embed/movie/" + id;
    streams.push({
      name: "Filmstoon",
      title: "\u{1F1EB}\u{1F1F7} VF \u2022 1080p Full HD (Serveur Principal)",
      url: url1,
      quality: "1080p",
      headers: HEADERS
    });
    streams.push({
      name: "Filmstoon",
      title: "\u{1F1EB}\u{1F1F7} MULTI (VF/VOSTFR) \u2022 1080p HD (Serveur 2)",
      url: url2,
      quality: "1080p",
      headers: HEADERS
    });
    streams.push({
      name: "Filmstoon",
      title: "\u{1F1EB}\u{1F1F7} VF \u2022 720p HD (Serveur Rapide)",
      url: url3,
      quality: "720p",
      headers: HEADERS
    });
    return streams;
  });
}

// src/filmstoon/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      return yield extractStreams(tmdbId, mediaType, season, episode);
    } catch (e) {
      return [];
    }
  });
}
module.exports = { getStreams };
module.exports.getStreams = getStreams;
module.exports.default = { getStreams };
