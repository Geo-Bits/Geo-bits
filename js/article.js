import { ThemeSystem, DataService, UX } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    ThemeSystem.init();
    
    const params = new URLSearchParams(window.location.search);
    const vizId = params.get('id');
    if (!vizId) { window.location.href = 'index.html'; return; }

    const data = await DataService.fetchAll();
    if (!data) return;

    const viz = data.visualizations.find(v => String(v.id) === String(vizId));
    if (viz) renderArticle(viz);
    else document.querySelector('.article-container').innerHTML = '<h2>Not found</h2>';
});

function renderArticle(viz) {
    document.title = viz.title;
    document.getElementById('art-title').textContent = viz.title;
    document.getElementById('art-category').textContent = viz.category;
    document.getElementById('art-img').src = viz.imageUrl;
    document.getElementById('art-desc').textContent = viz.detailContent?.description || viz.preview;
    document.getElementById('art-methodology').textContent = viz.detailContent?.methodology || 'N/A';
    
    const dateStr = viz.publishDate || 'Recently Updated';
    document.getElementById('art-meta').textContent = `Published: ${dateStr} • Source: ${viz.dataSource || 'Internal'}`;

    const list = document.getElementById('art-insights');
    const insights = viz.detailContent?.keyInsights || [];
    insights.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
    });

    document.getElementById('btn-download').onclick = () => UX.downloadImage(viz.imageUrl, viz.title);
    document.getElementById('btn-share').onclick = () => {
        if (navigator.share) navigator.share({ title: viz.title, url: window.location.href });
        else alert('Link copied!');
    };
}
