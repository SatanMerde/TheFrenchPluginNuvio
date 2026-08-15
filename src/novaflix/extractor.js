/**
 * Novaflix Extractor for Nuvio
 */
import { HEADERS } from './http.js';

export async function extractStreams(param1, param2, param3, param4) {
    let id = "";
    let type = "movie";
    let season = 1;
    let episode = 1;

    // Support all input formats (primitive args or object)
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

    if (!id || id === "undefined") return [];

    const normType = type.toLowerCase();
    const isTv = normType === "tv" || normType === "series" || normType === "show";

    const streams = [];

    // Serveur 1 : Lecteur Haute Définition VF
    const url1 = isTv
        ? "https://vidsrc.me/embed/tv?tmdb=" + id + "&season=" + season + "&episode=" + episode
        : "https://vidsrc.me/embed/movie?tmdb=" + id;

    // Serveur 2 : Lecteur Pro VF/MULTI
    const url2 = isTv
        ? "https://vidsrc.to/embed/tv/" + id + "/" + season + "/" + episode
        : "https://vidsrc.to/embed/movie/" + id;

    // Serveur 3 : Lecteur Rapide
    const url3 = isTv
        ? "https://embed.su/embed/tv/" + id + "/" + season + "/" + episode
        : "https://embed.su/embed/movie/" + id;

    streams.push({
        name: "Novaflix",
        title: "🇫🇷 VF • 1080p Full HD (Serveur Principal)",
        url: url1,
        quality: "1080p",
        headers: HEADERS
    });

    streams.push({
        name: "Novaflix",
        title: "🇫🇷 MULTI (VF/VOSTFR) • 1080p HD (Serveur 2)",
        url: url2,
        quality: "1080p",
        headers: HEADERS
    });

    streams.push({
        name: "Novaflix",
        title: "🇫🇷 VF • 720p HD (Serveur Rapide)",
        url: url3,
        quality: "720p",
        headers: HEADERS
    });

    return streams;
}
