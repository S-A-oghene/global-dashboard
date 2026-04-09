import { PLACEHOLDER_IMAGE, FALLBACK_DESCRIPTION } from './config.js';

export function renderLoading(container, message) {
    container.innerHTML = `<p class="loading-message">${message}</p>`;
}

export function renderError(container, message) {
    container.innerHTML = `<p class="error-message">⚠ ${message}</p>`;
}

export function renderNews(articles) {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p class="loading-message">No news found for this country.</p>';
        return;
    }

    newsContainer.innerHTML = articles.map(article => `
        <article class="news-card">
            <img 
                src="${article.image || PLACEHOLDER_IMAGE}" 
                alt="${(article.title || 'News article').substring(0, 100)}" 
                class="news-card-image"
                loading="lazy"
            >
            <div class="news-card-content">
                <h3 class="news-card-title">${article.title || 'Untitled Article'}</h3>
                <p class="news-card-description">${article.description || FALLBACK_DESCRIPTION}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">
                    Read More →
                </a>
            </div>
        </article>
    `).join('');
}

export function renderCurrency(rateOrError, country) {
    const currencyInfo = document.getElementById('currency-info');
    if (!currencyInfo) return;

    if (rateOrError instanceof Error) {
        const friendlyMsg = rateOrError.message.includes('not supported')
            ? `⚠️ ${country.currency} exchange rate not available from this API.`
            : `⚠️ ${rateOrError.message}`;
        currencyInfo.innerHTML = `<p class="error-message">${friendlyMsg}</p>`;
        return;
    }

    const rate = rateOrError;
    const timestamp = new Date().toLocaleString();
    currencyInfo.innerHTML = `
        <p class="currency-rate">1 USD = <span class="exchange-value">${rate.toFixed(2)}</span> ${country.currency}</p>
        <p class="currency-base">US Dollar to ${country.name}</p>
        <p class="currency-timestamp">Last updated: ${timestamp}</p>
    `;
}