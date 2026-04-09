import { GNEWS_API_TOKEN, GNEWS_BASE_URL, FRANKFURTER_BASE_URL } from './config.js';

export async function fetchNews(countryCode) {
    const url = `${GNEWS_BASE_URL}?country=${countryCode}&apikey=${GNEWS_API_TOKEN}&lang=en&max=6`;
    const response = await fetch(url);
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
    const url = `${FRANKFURTER_BASE_URL}?from=USD`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Frankfurter API error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.rates || typeof data.rates !== 'object') {
        throw new Error('Invalid response from Frankfurter API');
    }
    const rate = data.rates[targetCurrency];
    if (typeof rate !== 'number') {
        throw new Error(`Currency ${targetCurrency} is not supported by Frankfurter API.`);
    }
    return rate;
}