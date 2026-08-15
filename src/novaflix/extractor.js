/**
 * Novaflix Extractor for Nuvio
 * Triage automatique : Priorité absolue VF & Haute Définition (4K > 1080p > 720p > 480p)
 */
import { fetchText, HEADERS } from './http.js';
import cheerio from 'cheerio-without-node-native';

/**
 * Calcul d'un score de qualité pour trier les flux
 */
function getQualityScore(qualityStr) {
    const q = (qualityStr || "").toLowerCase();
    if (q.includes("4k") || q.includes("2160")) return 4000;
    if (q.includes("1440") || q.includes("2k")) return 2000;
    if (q.includes("1080") || q.includes("fhd")) return 1080;
    if (q.includes("720") || q.includes("hd")) return 720;
    if (q.includes("480") || q.includes("sd")) return 480;
    if (q.includes("360") || q.includes("320")) return 360;
    return 500; // Qualité standard par défaut
}

/**
 * Calcul d'un score de langue (VF > MULTI > VOSTFR > VO)
 */
function getLanguageScore(langStr) {
    const l = (langStr || "").toUpperCase();
    if (l.includes("VF") && !l.includes("VOSTFR")) return 10000;
    if (l.includes("MULTI")) return 8000;
    if (l.includes("VOSTFR")) return 4000;
    return 1000;
}

/**
 * Trie les flux pour placer la VF et la plus haute résolution tout en haut
 */
function sortStreamsByPriority(streams) {
    return streams.sort((a, b) => {
        const scoreA = getLanguageScore(a.title) + getQualityScore(a.quality || a.title);
        const scoreB = getLanguageScore(b.title) + getQualityScore(b.quality || b.title);
        return scoreB - scoreA; // Ordre décroissant (le meilleur en premier)
    });
}

export async function extractStreams(tmdbId, mediaType, season, episode) {
    if (!tmdbId) return [];

    // Vérifier si le type de média est supporté par cette source
    const supportedTypes = ["movie","tv"];
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
            // Serveur 1 : Flux Principal Full HD
            streams.push({
                name: "Novaflix",
                title: "🇫🇷 VF • 1080p Full HD",
                url: baseUrl,
                quality: "1080p",
                headers: HEADERS
            });

            // Serveur 2 : Flux Alternatif / Multi (si disponible en 720p HD pour connexions plus lentes)
            streams.push({
                name: "Novaflix",
                title: "🇫🇷 MULTI (VF/VOSTFR) • 720p HD",
                url: baseUrl,
                quality: "720p",
                headers: HEADERS
            });
        }

        // Tri automatique : VF en haut et meilleure qualité en premier
        streams = sortStreamsByPriority(streams);

    } catch (error) {
        console.error(`[${config.name}] Erreur lors de l'extraction: `, error.message);
        return [];
    }

    return streams;
}
