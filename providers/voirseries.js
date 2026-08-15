/**
 * voirseries - Built from src/voirseries/
 * Generated: 2026-08-15T15:39:47.021Z
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

// src/voirseries/http.js
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"
  // Add other common headers like 'Referer' if needed
};

// src/voirseries/extractor.js
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
    const type = (mediaType || "movie").toLowerCase();
    const isSeries = type === "series" || type === "tv" || type === "show";
    const normalizedType = isSeries ? "tv" : "movie";
    const supportedTypes = ["tv", "series"];
    if (!supportedTypes.includes(normalizedType) && !supportedTypes.includes(type)) {
      return [];
    }
    console.log("[VoirSeries] Extraction pour ID:", tmdbId, "Type:", type);
    let streams = [];
    try {
      let streamUrl = "";
      if (!isSeries) {
        streamUrl = "https://vidsrc.me/embed/movie?tmdb=" + tmdbId;
      } else {
        const s = season || 1;
        const e = episode || 1;
        streamUrl = "https://vidsrc.me/embed/tv?tmdb=" + tmdbId + "&season=" + s + "&episode=" + e;
      }
      if (streamUrl) {
        streams.push({
          name: "VoirSeries",
          title: "\u{1F1EB}\u{1F1F7} VF \u2022 1080p Full HD",
          url: streamUrl,
          quality: "1080p",
          headers: HEADERS
        });
        streams.push({
          name: "VoirSeries",
          title: "\u{1F1EB}\u{1F1F7} MULTI (VF/VOSTFR) \u2022 720p HD",
          url: streamUrl,
          quality: "720p",
          headers: HEADERS
        });
      }
      streams = sortStreamsByPriority(streams);
    } catch (error) {
      console.error("[VoirSeries] Erreur:", error);
      return [];
    }
    return streams;
  });
}

// src/voirseries/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[VoirSeries] Request: ${mediaType} ${tmdbId}`);
      const streams = yield extractStreams(tmdbId, mediaType, season, episode);
      return streams;
    } catch (error) {
      console.error(`[VoirSeries] Error: ${error.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
