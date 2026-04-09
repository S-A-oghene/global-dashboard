const STORAGE_KEY = 'active_region';

export function savePreference(countryCode) {
    localStorage.setItem(STORAGE_KEY, countryCode);
}

export function getPreference() {
    return localStorage.getItem(STORAGE_KEY) || 'us';
}