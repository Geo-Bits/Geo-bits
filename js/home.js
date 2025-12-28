import { Theme, Data } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    Theme.init();
    
    const data = await Data.fetch();
    if(!data) return;

    // News
    document.getElementById('news-grid').innerHTML = data.news_articles.map(a => `
        <article class="card" onclick="window.open('${a.externalLink}', '_blank')">
            <div class="card-body">
                <span class="badge" style="background:rgba(0,0,0,0.05); color:var(--text-muted)">${a.source}</span>
                <h3 style="font-size:1.2rem; margin:10px 0;">${a.title}</h3>
                <p style="color:var(--text-muted); font-size:0.9rem;">${a.preview}</p>
            </div>
        </article>
    `).join('');

    // Visuals
    const allViz = data.visualizations || [];
    const render = (filter = 'All', search = '') => {
        const grid = document.getElementById('viz-grid');
        const filtered = allViz.filter(v => {
            const matchCat = filter === 'All' || v.category === filter;
            const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
        
        grid.innerHTML = filtered.map(v => `
            <div class="card" onclick="window.location.href='article.html?id=${v.id}'">
                <div class="card-img-wrap"><img src="${v.imageUrl}" class="card-img" loading="lazy"></div>
                <div class="card-body">
                    <span class="badge">${v.category}</span>
                    <h4>${v.title}</h4>
                </div>
            </div>
        `).join('');
    };

    render();

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            render(e.target.dataset.filter, document.getElementById('search').value);
        });
    });
    
    document.getElementById('search').addEventListener('input', (e) => {
        const cat = document.querySelector('.filter-btn.active').dataset.filter;
        render(cat, e.target.value);
    });
});
