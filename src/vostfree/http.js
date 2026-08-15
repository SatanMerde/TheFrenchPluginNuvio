/**
 * Fast HTTP Utilities with strict Timeout for Nuvio
 */
export const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};

export async function fetchWithTimeout(url, options = {}, timeoutMs = 2000) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Timeout " + timeoutMs + "ms")), timeoutMs);
    });

    try {
        const fetchPromise = fetch(url, {
            headers: {
                ...HEADERS,
                ...options.headers
            },
            ...options
        });
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        return response;
    } catch (e) {
        clearTimeout(timeoutId);
        throw e;
    }
}

export async function fetchText(url, options = {}, timeoutMs = 2000) {
    const res = await fetchWithTimeout(url, options, timeoutMs);
    if (!res.ok) {
        throw new Error("HTTP error " + res.status);
    }
    return await res.text();
}

export async function fetchJson(url, options = {}, timeoutMs = 2000) {
    const text = await fetchText(url, options, timeoutMs);
    return JSON.parse(text);
}
