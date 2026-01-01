import { Theme, Data } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    Theme.init();

    const data = await Data.fetch();
    if (!data) return;
    document.getElementById('viz-loading')?.remove();

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
    let visibleCount = 6;   // how many cards to show initially
    const STEP = 6;         // how many to add per click
    const render = (filter = 'All', search = '') => {
        const grid = document.getElementById('viz-grid');
        const seeMoreContainer = document.getElementById('see-more-container');

        const filtered = allViz.filter(v => {
            const matchCat = filter === 'All' || v.category.toLowerCase() === filter.toLowerCase();
            const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });

        const visibleItems = filtered.slice(0, visibleCount);

        if (filtered.length === 0) {
            grid.innerHTML = `
        <p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px 0;">
            No visuals match your search or filter.
        </p>
    `;
            seeMoreContainer.style.display = 'none';
            return;
        }


        grid.innerHTML = visibleItems.map(v => `
        <div class="card" tabindex="0" onclick="window.location.href='article.html?id=${v.id}'">

            <div class="card-img-wrap"><img src="${v.imageUrl}" class="card-img" loading="lazy"></div>
            <div class="card-body">
                <span class="badge">${v.category}</span>
                <h4>${v.title}</h4>
            </div>
        </div>
    `).join('');

        // Toggle See More button
        if (filtered.length > visibleCount) {
            seeMoreContainer.style.display = 'block';
        } else {
            seeMoreContainer.style.display = 'none';
        }
    };

    render();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            visibleCount = 6; // RESET when filter changes

            render(e.target.dataset.filter, document.getElementById('search').value);
        });
    });


    document.getElementById('search').addEventListener('input', (e) => {
        visibleCount = 6; // RESET when search changes

        const cat = document.querySelector('.filter-btn.active').dataset.filter;
        render(cat, e.target.value);
    });
    document.getElementById('see-more-btn').addEventListener('click', () => {
        visibleCount += STEP;

        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchText = document.getElementById('search').value;

        render(activeFilter, searchText);
    });

});


