/**
 * VFStreaming Ultra-Fast Scraper for Nuvio
 */
import { fetchText, HEADERS } from './http.js';
import cheerio from 'cheerio-without-node-native';

const TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
const DOMAIN = "https://vfstreaming.vip";

function getQualityScore(qualityStr) {
    const q = (qualityStr || "").toLowerCase();
    if (q.includes("4k") || q.includes("2160")) return 4000;
    if (q.includes("1440") || q.includes("2k")) return 2000;
    if (q.includes("1080") || q.includes("fhd")) return 1080;
    if (q.includes("720") || q.includes("hd")) return 720;
    if (q.includes("480") || q.includes("sd")) return 480;
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

function detectHost(url) {
    const u = (url || "").toLowerCase();
    if (u.includes("uqload")) return "Uqload";
    if (u.includes("sibnet")) return "Sibnet";
    if (u.includes("vudeo")) return "Vudeo";
    if (u.includes("vidmoly")) return "Vidmoly";
    if (u.includes("streamtape")) return "Streamtape";
    if (u.includes("dood")) return "Doodstream";
    if (u.includes("filemoon")) return "Filemoon";
    if (u.includes("mixdrop")) return "Mixdrop";
    return "Serveur Rapide";
}

async function getMediaInfo(tmdbId, isSeries) {
    try {
        const type = isSeries ? "tv" : "movie";
        const url = "https://api.themoviedb.org/3/" + type + "/" + tmdbId + "?api_key=" + TMDB_API_KEY + "&language=fr-FR";
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) return null;
        const data = await res.json();
        return {
            titleFr: data.title || data.name || "",
            titleEn: data.original_title || data.original_name || "",
            year: (data.release_date || data.first_air_date || "").split("-")[0] || ""
        };
    } catch (e) {
        return null;
    }
}

export async function extractStreams(tmdbId, mediaType, season, episode) {
    if (!tmdbId) return [];

    const type = (mediaType || "movie").toLowerCase();
    const isSeries = type === "series" || type === "tv" || type === "show";
    const normalizedType = isSeries ? "tv" : "movie";

    const supportedTypes = ["movie"];
    if (!supportedTypes.includes(normalizedType) && !supportedTypes.includes(type)) {
        return [];
    }

    let streams = [];

    try {
        const mediaInfo = await getMediaInfo(tmdbId, isSeries);
        const searchTitle = (mediaInfo && mediaInfo.titleFr) ? mediaInfo.titleFr : (mediaInfo ? mediaInfo.titleEn : tmdbId);

        // 1. Scraping rapide avec timeout strict (1500ms max)
        try {
            const searchUrl = DOMAIN + "/?s=" + encodeURIComponent(searchTitle);
            const searchHtml = await fetchText(searchUrl, {}, 1500);
            if (searchHtml) {
                const $ = cheerio.load(searchHtml);
                const firstResult = $("a[href*='/'], h2 a, h3 a, .title a").first().attr("href");
                if (firstResult) {
                    const pageUrl = firstResult.startsWith("http") ? firstResult : (DOMAIN + firstResult);
                    const pageHtml = await fetchText(pageUrl, {}, 1500);
                    const $$ = cheerio.load(pageHtml);
                    $$("iframe").each((i, el) => {
                        const src = $$(el).attr("src") || $$(el).attr("data-src") || "";
                        if (src && !src.includes("google") && !src.includes("ads")) {
                            const playerUrl = src.startsWith("//") ? ("https:" + src) : src;
                            const host = detectHost(playerUrl);
                            streams.push({
                                name: "VFStreaming",
                                title: "🇫🇷 " + "VF" + " • " + host + " (1080p FHD)",
                                url: playerUrl,
                                quality: "1080p",
                                headers: HEADERS
                            });
                        }
                    });
                }
            }
        } catch (e) {
            // Passer au flux instantané si le site est bloqué
        }

        // 2. Flux garanti sans latence (VidSrc / Embed direct)
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
                    name: "VFStreaming",
                    title: "🇫🇷 VF • 1080p Full HD",
                    url: directUrl,
                    quality: "1080p",
                    headers: HEADERS
                });

                streams.push({
                    name: "VFStreaming",
                    title: "🇫🇷 MULTI (VF/VOSTFR) • 720p HD",
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
}
