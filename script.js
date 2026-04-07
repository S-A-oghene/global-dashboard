// script.js
const GNEWS_API_TOKEN = e4975963cfb5eb46f561b6fcbfbeb1eb; // <<< IMPORTANT: replace with your actual GNews API token
const GNEWS_BASE_URL = 'https://gnews.io/api/v4/top-headlines';
const FRANKFURTER_BASE_URL = 'https://api.frankfurter.app/latest';

const countries = [
    { code: 'us', name: 'united states', currency: 'USD' },
    { code: 'gb', name: 'united kingdom', currency: 'GBP' },
    { code: 'ng', name: 'nigeria', currency: 'NGN' },
    { code: 'ca', name: 'canada', currency: 'CAD' },
    { code: 'au', name: 'australia', currency: 'AUD' },
    { code: 'de', name: 'germany', currency: 'EUR' }, // germany uses EUR
    { code: 'in', name: 'india', currency: 'INR' },
    { code: 'jp', name: 'japan', currency: 'JPY' },
];

// dom elements
const countrySelect = document.getElementById('country-select');
const newsContainer = document.getElementById('news-container');
const currencyInfo = document.getElementById('currency-info');

const placeholderImage = 'https://via.placeholder.com/180x180?text=no+image';
const fallbackDescription = 'no description available for this article.';

// --- ui rendering functions ---

/**
 * renders a loading message in the specified container.
 * @param {HTMLElement} container - the dom element to render the message in.
 * @param {string} message - the loading message to display.
 */
function renderLoading(container, message) {
    container.innerHTML = `<p class="loading-message">${message}</p>`;
}

/**
 * renders an error message in the specified container.
 * @param {HTMLElement} container - the dom element to render the message in.
 * @param {string} message - the error message to display.
 */
function renderError(container, message) {
    container.innerHTML = `<p class="error-message">🚨 ${message}</p>`;
}

/**
 * renders news articles in the news container.
 * @param {Array} articles - an array of news article objects.
 */
function renderNews(articles) {
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p class="loading-message">no news found for this country.</p>';
        return;
    }

    newsContainer.innerHTML = articles.map(article => `
        <article class="news-card">
            <img src="${article.image || placeholderImage}" alt="${article.title || 'news article image'}" class="news-card-image">
            <div class="news-card-content">
                <h3 class="news-card-title">${article.title || 'untitled article'}</h3>
                <p class="news-card-description">${article.description || fallbackDescription}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">read more &rarr;</a>
            </div>
        </article>
    `).join('');
}

/**
 * renders currency exchange rate information.
 * @param {number} rate - the exchange rate.
 * @param {object} country - the selected country object.
 */
function renderCurrency(rate, country) {
    if (isNaN(rate) || !country || !country.currency) {
        currencyInfo.innerHTML = '<p class="error-message">could not fetch currency data.</p>';
        return;
    }

    const timestamp = new date().toLocaleString();
    currencyInfo.innerHTML = `
        <p class="currency-rate">1 USD = ${rate.toFixed(2)} ${country.currency}</p>
        <p class="currency-base">united states dollar to ${country.currency}</p>
        <p class="currency-timestamp">last updated: ${timestamp}</p>
    `;
}

// --- api fetching functions ---

/**
 * fetches top headlines for a given country code.
 * @param {string} countryCode - the two-letter country code (e.g., 'us').
 * @returns {Promise<Array>} - a promise that resolves to an array of articles.
 */
async function fetchNews(countryCode) {
    if (!GNEWS_API_TOKEN || GNEWS_API_TOKEN === 'YOUR_GNEWS_API_TOKEN') {
        throw new Error('gnews api token is not set. please update script.js.');
    }
    try {
        const response = await fetch(`${GNEWS_BASE_URL}?country=${countryCode}&token=${GNEWS_API_TOKEN}&lang=en&max=6`);
        if (!response.ok) {
            throw new Error(`gnews api error: ${response.statustext}`);
        }
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('error fetching news:', error);
        throw new Error(`failed to fetch news: ${error.message}`);
    }
}

/**
 * fetches the exchange rate from USD to the target currency.
 * @param {string} targetCurrency - the three-letter currency code (e.g., 'GBP').
 * @returns {Promise<number>} - a promise that resolves to the exchange rate.
 */
async function fetchRate(targetCurrency) {
    try {
        const response = await fetch(`${FRANKFURTER_BASE_URL}?from=USD&to=${targetCurrency}`);
        if (!response.ok) {
            throw new Error(`frankfurter api error: ${response.statustext}`);
        }
        const data = await response.json();
        if (data.rates && data.rates[targetCurrency]) {
            return data.rates[targetCurrency];
        } else {
            throw new Error('invalid currency data received.');
        }
    } catch (error) {
        console.error('error fetching exchange rate:', error);
        throw new Error(`failed to fetch exchange rate: ${error.message}`);
    }
}

// --- main dashboard update logic ---

/**
 * updates the dashboard with news and currency for the selected country.
 * @param {string} countryCode - the two-letter country code.
 */
async function updateDashboard(countryCode) {
    const country = countries.find(c => c.code === countryCode);

    renderLoading(newsContainer, 'fetching headlines...');
    renderLoading(currencyInfo, 'updating rates...');

    try {
        const [articles, rate] = await Promise.all([
            fetchNews(countryCode),
            fetchRate(country.currency)
        ]);
        renderNews(articles);
        renderCurrency(rate, country);
    } catch (error) {
        renderError(newsContainer, `could not load news: ${error.message}`);
        renderError(currencyInfo, `could not load currency: ${error.message}`);
    }
}

// --- initialization ---

/**
 * initializes the application: populates dropdown, loads saved preference, and updates dashboard.
 */
function init() {
    // populate <select> dropdown
    countries.forEach(c => {
        const option = document.createElement('option');
        option.value = c.code;
        option.textContent = c.name;
        countrySelect.appendChild(option);
    });

    // load saved preference from localStorage or default to 'us'
    const savedCountryCode = localStorage.getItem('active_region') || 'us';
    countrySelect.value = savedCountryCode;

    // add event listener for country selection change
    countrySelect.addEventListener('change', (e) => {
        const newCountryCode = e.target.value;
        localStorage.setItem('active_region', newCountryCode);
        updateDashboard(newCountryCode);
    });

    // initial dashboard update
    updateDashboard(savedCountryCode);
}

// run initialization when the dom is fully loaded
document.addEventListener('DOMContentLoaded', init);