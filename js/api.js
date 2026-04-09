import { 
    GNEWS_API_TOKEN, GNEWS_BASE_URL, FRANKFURTER_BASE_URL, CORS_PROXY 
} from './config.js';

/**
 * Attempts to fetch a URL, falling back to a CORS proxy if direct fetch fails.
 * @param {string} url - The original URL.
 * @param {string} apiName - Name of API for logging.
 * @returns {Promise<Response>}
 */
async function fetchWithFallback(url, apiName) {
    // First try direct fetch
    try {
        console.log(`🔍 Direct fetch: ${apiName}`);
        const response = await fetch(url);
        return response;
    } catch (directError) {
        console.warn(`⚠️ Direct fetch failed for ${apiName}, trying CORS proxy...`, directError);
        
        // Fallback to CORS proxy
        const proxyUrl = CORS_PROXY + encodeURIComponent(url);
        try {
            const proxyResponse = await fetch(proxyUrl);
            console.log(`✅ Proxy fetch succeeded for ${apiName}`);
            return proxyResponse;
        } catch (proxyError) {
            console.error(`❌ Proxy fetch also failed for ${apiName}:`, proxyError);
            throw new Error(
                `Unable to reach ${apiName}. Please check your internet connection ` +
                `and disable any ad blockers. (Error: ${proxyError.message})`
            );
        }
    }
}

export async function fetchNews(countryCode) {
    const url = `${GNEWS_BASE_URL}?country=${countryCode}&apikey=${GNEWS_API_TOKEN}&lang=en&max=6`;
    
    const response = await fetchWithFallback(url, 'GNews API');
    
    if (!response.ok) {
        let errorDetail = `HTTP ${response.status}`;
        try {
            const err = await response.json();
            errorDetail += `: ${err.errors?.join(', ') || response.statusText}`;
        } catch {
            errorDetail += `: ${response.statusText}`;
        }
        throw new Error(errorDetail);
    }

    const data = await response.json();
    if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error('Invalid response format from GNews API');
    }
    return data.articles;
}

export async function fetchRate(targetCurrency) {
    // Special case: USD to USD is always 1
    if (targetCurrency === 'USD') {
        console.log('💱 USD to USD rate: 1');
        return 1;
    }

    const url = `${FRANKFURTER_BASE_URL}?from=USD`;
    
    const response = await fetchWithFallback(url, 'Frankfurter API');
    
    if (!response.ok) {
        throw new Error(`Frankfurter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.rates || typeof data.rates !== 'object') {
        throw new Error('Invalid response from Frankfurter API');
    }

    const rate = data.rates[targetCurrency];
    if (typeof rate !== 'number') {
        throw new Error(`Currency ${targetCurrency} is not supported by Frankfurter API.`);
    }

    console.log(`💱 Rate for ${targetCurrency}: ${rate}`);
    return rate;
}