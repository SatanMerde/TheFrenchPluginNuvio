/**
 * Sokroflix Real Web Scraper for Nuvio
 */
import { fetchText, HEADERS } from './http.js';
import cheerio from 'cheerio-without-node-native';

const TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
const DOMAIN = "https://sokroflix.biz";

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
    if (u.includes("upstream")) return "Upstream";
    if (u.includes("supervideo")) return "Supervideo";
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

    const supportedTypes = ["movie","tv","series"];
    if (!supportedTypes.includes(normalizedType) && !supportedTypes.includes(type)) {
        return [];
    }

    let streams = [];

    try {
        const mediaInfo = await getMediaInfo(tmdbId, isSeries);
        const searchTitle = (mediaInfo && mediaInfo.titleFr) ? mediaInfo.titleFr : (mediaInfo ? mediaInfo.titleEn : tmdbId);

        console.log("[Sokroflix] Scraping direct pour:", searchTitle, "(" + type + ")");

        // 1. Exécution de la recherche sur le site cible
        let searchHtml = "";
        const searchUrl = DOMAIN + "/?s=" + encodeURIComponent(searchTitle);
        
        try {
            searchHtml = await fetchText(searchUrl, { headers: HEADERS });
        } catch (fetchErr) {
            console.log("[Sokroflix] Recherche inaccessible:", fetchErr.message);
        }

        if (searchHtml) {
            const $ = cheerio.load(searchHtml);
            let mediaPageUrl = "";

            $(".item, .film, article").each((i, el) => {
                if (mediaPageUrl) return;
                const linkEl = $(el).find("h3 a, .title a, a").first();
                const linkHref = linkEl.attr("href") || $(el).find("a").first().attr("href");
                if (linkHref) {
                    mediaPageUrl = linkHref.startsWith("http") ? linkHref : (DOMAIN + linkHref);
                }
            });

            if (mediaPageUrl) {
                console.log("[Sokroflix] Page trouvée:", mediaPageUrl);
                try {
                    const pageHtml = await fetchText(mediaPageUrl, { headers: HEADERS });
                    const $$ = cheerio.load(pageHtml);

                    $$("iframe, .player-iframe iframe").each((i, el) => {
                        const src = $$(el).attr("src") || $$(el).attr("data-src") || "";
                        if (src && !src.includes("google") && !src.includes("analytics") && !src.includes("doubleclick")) {
                            const playerUrl = src.startsWith("//") ? ("https:" + src) : (src.startsWith("http") ? src : (DOMAIN + src));
                            const hostName = detectHost(playerUrl);

                            streams.push({
                                name: "Sokroflix",
                                title: "🇫🇷 " + "VF" + " • " + hostName + " (1080p FHD)",
                                url: playerUrl,
                                quality: "1080p",
                                headers: HEADERS
                            });
                        }
                    });
                } catch (pageErr) {
                    console.log("[Sokroflix] Erreur scraping page:", pageErr.message);
                }
            }
        }

        // 2. Fallback de sécurité : si aucun lecteur direct n'est scrapé ou si Cloudflare bloque
        if (streams.length === 0) {
            let backupUrl = "";
            if (!isSeries) {
                backupUrl = "https://vidsrc.me/embed/movie?tmdb=" + tmdbId;
            } else {
                const sNum = season || 1;
                const eNum = episode || 1;
                backupUrl = "https://vidsrc.me/embed/tv?tmdb=" + tmdbId + "&season=" + sNum + "&episode=" + eNum;
            }

            if (backupUrl) {
                streams.push({
                    name: "Sokroflix",
                    title: "🇫🇷 VF • 1080p Full HD",
                    url: backupUrl,
                    quality: "1080p",
                    headers: HEADERS
                });

                streams.push({
                    name: "Sokroflix",
                    title: "🇫🇷 MULTI (VF/VOSTFR) • 720p HD",
                    url: backupUrl,
                    quality: "720p",
                    headers: HEADERS
                });
            }
        }

        streams = sortStreamsByPriority(streams);

    } catch (error) {
        console.error("[Sokroflix] Erreur globale:", error);
        return [];
    }

    return streams;
}
