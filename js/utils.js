/**
 * Geo-Bits Utility Core v4
 */
export const ThemeSystem = {
    init() {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        this.updateIcons(saved);
        
        // Mobile Menu
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if(menuBtn) {
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            });
        }
    },
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        this.updateIcons(next);
    },
    updateIcons(theme) {
        const icon = theme === 'light' ? '🌙' : '☀️';
        document.querySelectorAll('.theme-toggle').forEach(btn => btn.textContent = icon);
    }
};

export const DataService = {
    async fetchAll() {
        try {
            const resp = await fetch('data.json');
            if (!resp.ok) throw new Error('Failed');
            return await resp.json();
        } catch (e) { console.error(e); return null; }
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
    trackEvent(name, params) {
        if (typeof gtag === 'function') gtag('event', name, params);
    }
};
