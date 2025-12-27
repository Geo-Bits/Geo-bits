import { ThemeSystem, DataService, UX } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    ThemeSystem.init();
    document.querySelector('.theme-toggle').addEventListener('click', () => ThemeSystem.toggle());

    // 1. Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const vizId = params.get('id');

    if (!vizId) {
        window.location.href = 'index.html'; // Redirect if no ID
        return;
    }

    // 2. Load Data
    const data = await DataService.fetchAll();
    if (!data) return;

    const viz = data.visualizations.find(v => String(v.id) === String(vizId));
    
    if (viz) {
        renderArticle(viz);
    } else {
        document.querySelector('.article-container').innerHTML = '<h2>Visual not found.</h2><a href="index.html">Go Back</a>';
    }
});

function renderArticle(viz) {
    // Populate Metadata
    document.title = `${viz.title} | Geo-Bits Analysis`;
    document.getElementById('art-title').textContent = viz.title;
    document.getElementById('art-category').textContent = viz.category;
    document.getElementById('art-img').src = viz.imageUrl;
    document.getElementById('art-desc').textContent = viz.detailContent?.description || viz.preview;
    document.getElementById('art-methodology').textContent = viz.detailContent?.methodology || 'N/A';
    
    // Populate Meta Date
    const dateStr = viz.publishDate || 'Recently Updated';
    const sourceStr = viz.dataSource || 'Internal Analysis';
    document.getElementById('art-meta').textContent = `Published: ${dateStr} • Source: ${sourceStr}`;

    // Populate Insights
    const insightsList = document.getElementById('art-insights');
    const insights = viz.detailContent?.keyInsights || ["No detailed insights available."];
    insights.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        insightsList.appendChild(li);
    });

    // Wire up Buttons
    document.getElementById('btn-download').onclick = () => {
        UX.trackEvent('file_download', { file_name: viz.title });
        UX.downloadImage(viz.imageUrl, viz.title);
    };
    
    document.getElementById('btn-share').onclick = () => {
        if (navigator.share) navigator.share({ title: viz.title, url: window.location.href });
        else alert('Link copied!');
    };
    
    // Track View
    UX.trackEvent('view_item', { item_name: viz.title, item_category: viz.category });
}
