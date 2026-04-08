/*
 * Global Insight Dashboard - Main Script
 * 
 * This application displays real-time news headlines and currency exchange rates
 * for selected countries. It uses the GNews API for headlines and the Frankfurter
 * API for exchange rates.
 * 
 * IMPORTANT: Replace 'YOUR_GNEWS_API_TOKEN_HERE' with your actual GNews API token
 * from https://gnews.io
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const GNEWS_API_TOKEN = 'e4975963cfb5eb46f561b6fcbfbeb1eb'; // Replace with your actual GNews API token
const GNEWS_BASE_URL = 'https://gnews.io/api/v4/top-headlines';
const FRANKFURTER_BASE_URL = 'https://api.frankfurter.app/latest';

/**
 * MAJOR FUNCTION 1: Country Configuration
 * Defines supported countries with their codes and currencies.
 * This array is used to populate the dropdown and map country codes to currencies.
 */
const countries = [
    { code: 'us', name: 'United States', currency: 'USD' },
    { code: 'gb', name: 'United Kingdom', currency: 'GBP' },
    { code: 'ng', name: 'Nigeria', currency: 'NGN' },
    { code: 'ca', name: 'Canada', currency: 'CAD' },
    { code: 'au', name: 'Australia', currency: 'AUD' },
    { code: 'de', name: 'Germany', currency: 'EUR' },
    { code: 'in', name: 'India', currency: 'INR' },
    { code: 'jp', name: 'Japan', currency: 'JPY' },
];

// DOM elements cache
const countrySelect = document.getElementById('country-select');
const newsContainer = document.getElementById('news-container');
const currencyInfo = document.getElementById('currency-info');

// Image and text fallbacks for graceful error handling
const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';
const fallbackDescription = 'No description available for this article.';

// ============================================================================
// MAJOR FUNCTION 2: UI RENDERING - Loading Indicators
// Handles displaying loading messages to users while fetching data
// ============================================================================

/**
 * Renders a loading message in the specified container.
 * This provides visual feedback that the app is working.
 * 
 * @param {HTMLElement} container - The DOM element to render the message in.
 * @param {string} message - The loading message to display.
 */
function renderLoading(container, message) {
    container.innerHTML = `<p class="loading-message">${message}</p>`;
}

// ============================================================================
// MAJOR FUNCTION 3: Error Handling - Graceful Error Messages
// Displays friendly error messages instead of crashing the application
// ============================================================================

/**
 * Renders an error message in the specified container.
 * Prevents the app from crashing and informs the user of what went wrong.
 * 
 * @param {HTMLElement} container - The DOM element to render the message in.
 * @param {string} message - The error message to display.
 */
function renderError(container, message) {
    container.innerHTML = `<p class="error-message">⚠ ${message}</p>`;
}

// ============================================================================
// MAJOR FUNCTION 4: News Rendering
// Displays news articles with images, titles, descriptions, and links
// Includes placeholder handling for missing images and descriptions
// ============================================================================

/**
 * Renders news articles in the news container.
 * Handles missing images with placeholders and missing descriptions with fallback text.
 * Articles are displayed in a responsive grid layout.
 * 
 * @param {Array} articles - An array of news article objects from the API.
 */
function renderNews(articles) {
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p class="loading-message">No news found for this country.</p>';
        return;
    }

    newsContainer.innerHTML = articles.map(article => `
        <article class="news-card">
            <img 
                src="${article.image || placeholderImage}" 
                alt="${(article.title || 'News article').substring(0, 100)}" 
                class="news-card-image"
                loading="lazy"
            >
            <div class="news-card-content">
                <h3 class="news-card-title">${article.title || 'Untitled Article'}</h3>
                <p class="news-card-description">${article.description || fallbackDescription}</p>
                <a 
                    href="${article.url}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="read-more"
                    aria-label="Read full article: ${(article.title || 'Untitled').substring(0, 50)}"
                >
                    Read More →
                </a>
            </div>
        </article>
    `).join('');
}

// ============================================================================
// MAJOR FUNCTION 5: Currency Exchange Rate Display
// Shows the current exchange rate from USD to the selected country's currency
// with a formatted timestamp
// ============================================================================

/**
 * Renders currency exchange rate information.
 * Displays the rate prominently with a timestamp of when it was last updated.
 * 
 * @param {number} rate - The exchange rate (amount of target currency per 1 USD).
 * @param {object} country - The selected country object containing name and currency code.
 */
function renderCurrency(rate, country) {
    if (isNaN(rate) || !country || !country.currency) {
        currencyInfo.innerHTML = '<p class="error-message">Could not fetch currency data.</p>';
        return;
    }

    const timestamp = new Date().toLocaleString();
    const countryName = country.name;
    const currencyCode = country.currency;
    
    currencyInfo.innerHTML = `
        <p class="currency-rate">1 USD = <span class="exchange-value">${rate.toFixed(2)}</span> ${currencyCode}</p>
        <p class="currency-base">US Dollar to ${countryName}</p>
        <p class="currency-timestamp">Last updated: ${timestamp}</p>
    `;
}

// ============================================================================
// MAJOR FUNCTION 6: GNews API Integration
// Fetches top news headlines for the selected country
// ============================================================================

/**
 * Fetches top headlines for a given country code from the GNews API.
 * Respects the GNews free tier limit of 100 requests per day.
 * 
 * @param {string} countryCode - The two-letter country code (e.g., 'us').
 * @returns {Promise<Array>} A promise that resolves to an array of article objects.
 * @throws {Error} If the API token is not set or if the API request fails.
 */
async function fetchNews(countryCode) {
    if (!GNEWS_API_TOKEN || GNEWS_API_TOKEN === 'YOUR_GNEWS_API_TOKEN_HERE') {
        throw new Error('GNews API token is not set. Please update script.js with your API key from https://gnews.io');
    }
    
    try {
        const url = `${GNEWS_BASE_URL}?country=${countryCode}&token=${GNEWS_API_TOKEN}&lang=en&max=6`;
        console.log('🔍 Fetching news from URL:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`GNews API error: ${response.statusText} (${response.status})`);
        }
        
        const data = await response.json();
        console.log('✅ News data received:', data);
        
        if (!data.articles || !Array.isArray(data.articles)) {
            throw new Error('Invalid response format from GNews API');
        }
        
        console.log(`📰 Found ${data.articles.length} articles`);
        return data.articles;
    } catch (error) {
        console.error('❌ News fetch error:', error);
        throw new Error(`Failed to fetch news: ${error.message}`);
    }
}

// ============================================================================
// MAJOR FUNCTION 7: Frankfurter API Integration
// Fetches current exchange rates for currency conversion
// ============================================================================

/**
 * Fetches the current exchange rate from USD to the target currency.
 * Uses the Frankfurter API which does not require an API key.
 * 
 * @param {string} targetCurrency - The three-letter ISO currency code (e.g., 'GBP', 'EUR').
 * @returns {Promise<number>} A promise that resolves to the exchange rate.
 * @throws {Error} If the API request fails or returns invalid data.
 */
async function fetchRate(targetCurrency) {
    try {
        const url = `${FRANKFURTER_BASE_URL}?from=USD&to=${targetCurrency}`;
        console.log('🔍 Fetching exchange rate from URL:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Frankfurter API error: ${response.statusText} (${response.status})`);
        }
        
        const data = await response.json();
        console.log('✅ Exchange rate data received:', data);
        
        if (!data.rates || !data.rates[targetCurrency]) {
            throw new Error(`No rate data for currency ${targetCurrency}`);
        }
        
        console.log(`💱 Exchange rate: 1 USD = ${data.rates[targetCurrency]} ${targetCurrency}`);
        return data.rates[targetCurrency];
    } catch (error) {
        console.error('❌ Exchange rate fetch error:', error);
        throw new Error(`Failed to fetch exchange rate: ${error.message}`);
    }
}

// ============================================================================
// MAJOR FUNCTION 8: Responsive Dashboard Update
// Orchestrates fetching news and currency data in parallel and updating the UI
// ============================================================================

/**
 * Updates the dashboard with news and currency data for the selected country.
 * Fetches news and exchange rate in parallel using Promise.all for performance.
 * Shows loading indicators while fetching and handles errors gracefully.
 * 
 * @param {string} countryCode - The two-letter country code to fetch data for.
 */
async function updateDashboard(countryCode) {
    const country = countries.find(c => c.code === countryCode);
    
    if (!country) {
        renderError(newsContainer, 'Selected country not found.');
        renderError(currencyInfo, 'Selected country not found.');
        return;
    }

    console.log(`🌍 Loading data for country: ${country.name} (${countryCode}) - Currency: ${country.currency}`);

    // Show loading indicators while fetching data
    renderLoading(newsContainer, 'Fetching headlines...');
    renderLoading(currencyInfo, 'Updating rates...');

    try {
        // Fetch both news and exchange rate in parallel for better performance
        const [articles, rate] = await Promise.all([
            fetchNews(countryCode),
            fetchRate(country.currency)
        ]);
        
        console.log('✅ All data fetched successfully');
        // Render the fetched data
        renderNews(articles);
        renderCurrency(rate, country);
    } catch (error) {
        // Display friendly error messages instead of crashing
        console.error('❌ Dashboard update error:', error.message);
        renderError(newsContainer, error.message);
        renderError(currencyInfo, error.message);
    }
}

// ============================================================================
// MAJOR FUNCTION 9: Persistent User Preference (LocalStorage)
// Saves and restores the user's selected country across page reloads
// ============================================================================

/**
 * Saves the selected country to localStorage.
 * This ensures the user's preference is remembered between sessions.
 * 
 * @param {string} countryCode - The country code to save.
 */
function saveUserPreference(countryCode) {
    localStorage.setItem('active_region', countryCode);
}

/**
 * Retrieves the user's saved country preference from localStorage.
 * Returns a default value if no preference exists.
 * 
 * @returns {string} The saved country code or 'us' as default.
 */
function getUserPreference() {
    return localStorage.getItem('active_region') || 'us';
}

// ============================================================================
// MAJOR FUNCTION 10: Application Initialization & Event Handling
// Sets up the country dropdown, restores user preferences, and handles interactions
// ============================================================================

/**
 * Initializes the application:
 * 1. Populates the country dropdown from the countries array
 * 2. Restores the user's previously selected country from localStorage
 * 3. Attaches event listeners for country selection changes
 * 4. Performs the initial dashboard update
 * 
 * This function is called when the DOM is fully loaded.
 */
function init() {
    console.log('🚀 Initializing Global Insight Dashboard...');
    
    // Verify DOM elements exist
    if (!countrySelect || !newsContainer || !currencyInfo) {
        console.error('❌ CRITICAL: DOM elements not found!');
        console.error('countrySelect:', countrySelect);
        console.error('newsContainer:', newsContainer);
        console.error('currencyInfo:', currencyInfo);
        return;
    }
    
    console.log('✅ DOM elements found');
    
    // Populate the country dropdown with all available countries
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
    
    console.log(`✅ Dropdown populated with ${countries.length} countries`);

    // Load saved preference from localStorage or default to 'us'
    const savedCountryCode = getUserPreference();
    countrySelect.value = savedCountryCode;
    console.log(`✅ Saved preference loaded: ${savedCountryCode}`);

    // Add event listener for country selection changes
    countrySelect.addEventListener('change', (event) => {
        const newCountryCode = event.target.value;
        console.log(`🔄 Country changed to: ${newCountryCode}`);
        
        // Save the new preference to localStorage
        saveUserPreference(newCountryCode);
        
        // Update the dashboard with data for the new country
        updateDashboard(newCountryCode);
    });

    console.log('✅ Event listeners attached');
    
    // Perform initial dashboard update with the saved (or default) country
    console.log('📊 Performing initial dashboard update...');
    updateDashboard(savedCountryCode);
}

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

console.log('📱 Global Insight Dashboard script loaded');
console.log('🔑 API Token present:', !!GNEWS_API_TOKEN && GNEWS_API_TOKEN !== 'YOUR_GNEWS_API_TOKEN_HERE');

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM fully loaded, initializing app...');
    init();
});