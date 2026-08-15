/**
 * Sokroflix Extractor for Nuvio
 */
import { HEADERS } from './http.js';

function getQualityScore(qualityStr) {
    const q = (qualityStr || "").toLowerCase();
    if (q.includes("4k") || q.includes("2160")) return 4000;
    if (q.includes("1440") || q.includes("2k")) return 2000;
    if (q.includes("1080") || q.includes("fhd")) return 1080;
    if (q.includes("720") || q.includes("hd")) return 720;
    if (q.includes("480") || q.includes("sd")) return 480;
    if (q.includes("360") || q.includes("320")) return 360;
    return 500;
}

function getLanguageScore(langStr) {
    const l = (langStr || "").toUpperCase();
    if (l.includes("VF") && !l.includes("VOSTFR")) return 10000;
    if (l.includes("MULTI")) return 8000;
    if (l.includes("VOSTFR")) return 4000;
    return 1000;
}

function sortStreamsByPriority(streams) {
    return streams.sort((a, b) => {
        const scoreA = getLanguageScore(a.title) + getQualityScore(a.quality || a.title);
        const scoreB = getLanguageScore(b.title) + getQualityScore(b.quality || b.title);
        return scoreB - scoreA;
    });
}

export async function extractStreams(tmdbId, mediaType, season, episode) {
    if (!tmdbId) return [];

    const type = (mediaType || "movie").toLowerCase();
    const isSeries = type === "series" || type === "tv" || type === "show";
    const normalizedType = isSeries ? "tv" : "movie";

    const supportedTypes = ["movie","tv","series"];
    if (!supportedTypes.includes(normalizedType) && !supportedTypes.includes(type)) {
        return [];
    }

    console.log("[Sokroflix] Extraction pour ID:", tmdbId, "Type:", type);
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
                name: "Sokroflix",
                title: "🇫🇷 VF • 1080p Full HD",
                url: streamUrl,
                quality: "1080p",
                headers: HEADERS
            });

            streams.push({
                name: "Sokroflix",
                title: "🇫🇷 MULTI (VF/VOSTFR) • 720p HD",
                url: streamUrl,
                quality: "720p",
                headers: HEADERS
            });
        }

        streams = sortStreamsByPriority(streams);

    } catch (error) {
        console.error("[Sokroflix] Erreur:", error);
        return [];
    }

    return streams;
}
