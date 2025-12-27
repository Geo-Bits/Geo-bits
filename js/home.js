import { ThemeSystem, DataService, UX } from './utils.js';

let state = { visuals: [], filter: 'All', search: '' };

document.addEventListener('DOMContentLoaded', async () => {
    ThemeSystem.init();
    setupNavbar();
    
    const data = await DataService.fetchAll();
    if (data) {
        // Render News
        const newsGrid = document.getElementById('news-grid');
        newsGrid.innerHTML = data.news_articles.map(a => `
            <article class="card news-card">
                <div class="card-body">
                    <div class="news-meta">
                        <span style="color:var(--color-brand-primary); font-weight:bold;">${a.source}</span>
                        <span style="color:var(--text-muted)">• ${a.date}</span>
                    </div>
                    <h3 style="margin: 12px 0;">${a.title}</h3>
                    <p style="color:var(--text-muted); margin-bottom:16px;">${a.preview}</p>
                    <a href="${a.externalLink}" target="_blank" class="btn-text">Read Full Story &rarr;</a>
                </div>
            </article>
        `).join('');

        // Store Visuals & Render
        state.visuals = data.visualizations || [];
        renderVisuals();
        setupFilters();
    }
});

function renderVisuals() {
    const container = document.getElementById('viz-grid');
    const filtered = state.visuals.filter(v => {
        const matchesCat = state.filter === 'All' || v.category === state.filter;
        const matchesSearch = v.title.toLowerCase().includes(state.search.toLowerCase());
        return matchesCat && matchesSearch;
    });
    
    container.innerHTML = filtered.map(v => `
        <div class="card viz-card" onclick="window.location.href='article.html?id=${v.id}'">
            <div class="card-img-wrap">
                <img src="${v.imageUrl}" class="card-img" loading="lazy" alt="${v.title}">
            </div>
            <div class="card-body">
                <span class="badge">${v.category}</span>
                <h4>${v.title}</h4>
                <div style="margin-top:8px; font-size:0.9rem; color:var(--text-muted);">Click to read analysis →</div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.filter = e.target.dataset.filter;
            renderVisuals();
        });
    });
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.search = e.target.value;
        renderVisuals();
    });
}

function setupNavbar() {
    document.querySelector('.theme-toggle').addEventListener('click', () => ThemeSystem.toggle());
}
