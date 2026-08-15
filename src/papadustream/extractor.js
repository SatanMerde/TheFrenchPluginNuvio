/**
 * PapaDuStream Extractor for Nuvio
 */
import { fetchText, HEADERS } from './http.js';
import cheerio from 'cheerio-without-node-native';

export async function extractStreams(tmdbId, mediaType, season, episode) {
    if (!tmdbId) return [];

    // Vérifier si le type de média est supporté par cette source
    const supportedTypes = ["movie","tv"];
    if (!supportedTypes.includes(mediaType)) {
        return [];
    }

    console.log(`[${config.name}] Recherche de flux pour: ${tmdbId} (${mediaType})`);
    const streams = [];

    try {
        let streamUrl = "";
        
        if (mediaType === "movie") {
            streamUrl = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
        } else if (mediaType === "tv") {
            const s = season || 1;
            const e = episode || 1;
            streamUrl = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}`;
        }

        if (streamUrl) {
            streams.push({
                name: "PapaDuStream",
                title: "VF • 1080p FHD",
                url: streamUrl,
                quality: "1080p",
                headers: HEADERS
            });
        }
    } catch (error) {
        console.error(`[${config.name}] Erreur lors de l'extraction: `, error.message);
        return [];
    }

    return streams;
}
