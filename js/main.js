import { countries } from './config.js';
import { savePreference, getPreference } from './storage.js';
import { fetchNews, fetchRate } from './api.js';
import { renderLoading, renderError, renderNews, renderCurrency } from './ui.js';

const countrySelect = document.getElementById('country-select');
const newsContainer = document.getElementById('news-container');
const currencyInfo = document.getElementById('currency-info');

async function updateDashboard(countryCode) {
    const country = countries.find(c => c.code === countryCode);
    if (!country) {
        renderError(newsContainer, 'Selected country not found.');
        renderError(currencyInfo, 'Selected country not found.');
        return;
    }

    renderLoading(newsContainer, 'Fetching headlines...');
    renderLoading(currencyInfo, 'Updating rates...');

    try {
        const [articles, rate] = await Promise.all([
            fetchNews(countryCode),
            fetchRate(country.currency)
        ]);
        renderNews(articles);
        renderCurrency(rate, country);
    } catch (error) {
        console.error('Dashboard error:', error);
        renderError(newsContainer, `News: ${error.message}`);
        renderCurrency(error, country);  // pass error object for friendly display
    }
}

function init() {
    // Populate dropdown
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });

    const savedCode = getPreference();
    countrySelect.value = savedCode;

    countrySelect.addEventListener('change', (e) => {
        const newCode = e.target.value;
        savePreference(newCode);
        updateDashboard(newCode);
    });

    updateDashboard(savedCode);
}

document.addEventListener('DOMContentLoaded', init);