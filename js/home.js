import { ThemeSystem, DataService, UX } from './utils.js';
let state = { visuals: [], filter: 'All', search: '' };

document.addEventListener('DOMContentLoaded', async () => {
    ThemeSystem.init();
    
    const data = await DataService.fetchAll();
    if (data) {
        // News
        const newsGrid = document.getElementById('news-grid');
        newsGrid.innerHTML = data.news_articles.map(a => `
            <article class="card" onclick="window.open('${a.externalLink}', '_blank')">
                <div class="card-body">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:12px;">
                        <span style="color:var(--color-brand-primary); font-weight:700;">${a.source}</span>
                        <span style="color:var(--text-muted)">${a.date}</span>
                    </div>
                    <h3 style="margin-bottom:12px; font-size:1.2rem;">${a.title}</h3>
                    <p style="color:var(--text-muted); font-size:0.95rem;">${a.preview}</p>
                    <span style="color:var(--color-brand-primary); font-weight:600; font-size:0.9rem;">Read Story →</span>
                </div>
            </article>
        `).join('');

        // Visuals
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
        <div class="card" onclick="window.location.href='article.html?id=${v.id}'">
            <div class="card-img-wrap">
                <img src="${v.imageUrl}" class="card-img" loading="lazy" alt="${v.title}">
            </div>
            <div class="card-body">
                <span class="badge">${v.category}</span>
                <h4 style="margin-top:8px;">${v.title}</h4>
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
