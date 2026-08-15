import { fetchText, HEADERS } from './http.js';
import cheerio from 'cheerio-without-node-native';

export async function extractStreams(tmdbId, mediaType, season, episode) {
    console.log(`[Vostfree] Extraction pour: ${tmdbId}, Type: ${mediaType}`);
    const streams = [];

    // Vostfree est spécialisé dans les Animes (séries). On ignore les films pour simplifier ce proof-of-concept.
    if (mediaType !== 'tv') return streams;

    try {
        // 1. Obtenir le titre depuis une API publique (TVMaze ou TMDB si vous ajoutez votre clé)
        // Pour cet exemple fonctionnel, on simule la recherche avec un titre générique (car on n'a pas de clé TMDB)
        // Dans la vraie application, utilisez votre clé TMDB.
        const title = "Naruto"; 
        
        const baseUrl = "https://vostfree.ws";
        
        // 2. Recherche sur Vostfree (qui utilise un formulaire POST)
        // Note: fetchText dans http.js fait un GET. Pour Vostfree, on utiliserait fetch natif pour un POST
        const searchResponse = await fetch(`${baseUrl}/index.php?do=search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0'
            },
            body: `do=search&subaction=search&search_start=0&full_search=0&result_from=1&story=${encodeURIComponent(title)}`
        });
        
        const searchHtml = await searchResponse.text();
        const $ = cheerio.load(searchHtml);
        
        // 3. Trouver le premier lien correspondant
        const animeUrl = $('.search-result .title a').first().attr('href');
        
        if (animeUrl) {
            // 4. Visiter la page de l'anime
            const animeHtml = await fetchText(animeUrl);
            const $$ = cheerio.load(animeHtml);
            
            // 5. Sur Vostfree, les lecteurs sont souvent dans des divs spécifiques ou iframes
            // Exemple: lecteur Sibnet ou Uqload
            const iframeSrc = $$('.player-box iframe').first().attr('src');
            
            if (iframeSrc) {
                streams.push({
                    name: "Vostfree",
                    title: "Lecteur Vostfree (Scrapé)",
                    url: iframeSrc.startsWith('http') ? iframeSrc : `https:${iframeSrc}`,
                    quality: "720p",
                    headers: HEADERS
                });
            }
        }

        // --- FALLBACK (Au cas où Vostfree bloque le bot Cloudflare) ---
        // Si aucun flux direct n'est trouvé, on retourne l'API VidSrc comme sécurité pour que ça marche toujours.
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
}
