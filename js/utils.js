
export const Theme = {
    init() {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        this.updateIcons(saved);
        
        // Select ALL theme buttons (Desktop + Mobile + About Page)
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });

        // Mobile Menu
        const menuBtn = document.querySelector('.mobile-toggle');
        const nav = document.querySelector('.nav-links');
        if(menuBtn && nav) {
            menuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuBtn.textContent = nav.classList.contains('active') ? '✕' : '☰';
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
        document.querySelectorAll('.theme-btn').forEach(btn => btn.textContent = icon);
    }
};

export const Data = {
    async fetch() {
        try {
            const res = await fetch('data.json');
            return await res.json();
        } catch(e) { console.error(e); return null; }
    }
};

export const UX = {
    download(url, name) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `GeoBits_${name.replace(/\s+/g,'_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    
    share(title, url) {
        if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => { console.error(err); });
        }
    }
};
