/**
 * Geo-Bits Utility Core
 */

export const ThemeSystem = {
    init() {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        this.updateToggleIcon(saved);
    },
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        this.updateToggleIcon(next);
    },
    updateToggleIcon(theme) {
        const icon = theme === 'light' ? '🌙' : '☀️';
        document.querySelectorAll('.theme-toggle').forEach(btn => btn.textContent = icon);
    }
};

export const DataService = {
    async fetchAll() {
        try {
            const resp = await fetch('data.json');
            if (!resp.ok) throw new Error('Failed to load data');
            return await resp.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};

export const UX = {
    downloadImage(url, title) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `GeoBits-${title.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Download started...');
    },
    
    // GA4 Tracking Wrapper
    trackEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        } else {
            console.log('Tracking Event:', eventName, params);
        }
    }
};