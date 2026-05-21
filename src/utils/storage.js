/**
 * storage.js — localStorage helper utilities
 *
 * Provides:
 *   storage.get(key, fallback?)  — get raw string value
 *   storage.set(key, value)      — set raw string value
 *   storage.remove(key)          — remove key
 *   storage.getInt(key, fallback?) — get value parsed as integer
 *   storage.getJSON(key)         — safely parse JSON, returns null on failure
 *   storage.setJSON(key, value)  — safely stringify + store JSON
 */

const storage = {

    get(key, fallback = null) {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? val : fallback;
        } catch (_) {
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (_) {}
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (_) {}
    },

    getInt(key, fallback = 0) {
        const val = parseInt(storage.get(key, String(fallback)));
        return isNaN(val) ? fallback : val;
    },

    getJSON(key) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return null;
            return JSON.parse(raw);
        } catch (_) {
            return null;
        }
    },

    setJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (_) {}
    },

};

export default storage;