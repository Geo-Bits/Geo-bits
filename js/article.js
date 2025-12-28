import { Theme, Data, UX } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    Theme.init();
    
    const id = new URLSearchParams(window.location.search).get('id');
    const data = await Data.fetch();
    const viz = data?.visualizations.find(v => String(v.id) === id);

    if(!viz) return;

    // Render Article
    document.title = viz.title;
    document.getElementById('art-cat').textContent = viz.category;
    document.getElementById('art-title').textContent = viz.title;
    document.getElementById('art-img').src = viz.imageUrl;
    document.getElementById('art-desc').textContent = viz.detailContent?.description || viz.preview;
    document.getElementById('art-source').textContent = viz.detailContent?.methodology || 'N/A';
    
    // --- Dynamic Author Logic (Fix) ---
    const authorName = viz.author || "Somesh Kota";
    const authorRole = viz.authorRole || "Founder & Analyst";
    const initials = authorName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    
    document.getElementById('auth-name').textContent = authorName;
    document.getElementById('auth-role').textContent = authorRole;
    document.getElementById('auth-initials').textContent = initials;
    
    const linkEl = document.getElementById('auth-link');
    linkEl.href = viz.authorLink || "https://linkedin.com/in/someshkota";

    // Insights
    const list = document.getElementById('art-insights');
    list.innerHTML = '';
    (viz.detailContent?.keyInsights || []).forEach(i => {
        list.innerHTML += `<li style="margin-bottom:8px;">${i}</li>`;
    });

    // Buttons
    document.getElementById('btn-dl').onclick = () => UX.download(viz.imageUrl, viz.title);
    
    // Like & Share
    const likeBtn = document.getElementById('btn-like');
    const storageKey = `liked_${viz.id}`;
    
    if(localStorage.getItem(storageKey)) {
        likeBtn.classList.add('liked');
        likeBtn.innerHTML = '❤️ Liked';
    }

    likeBtn.onclick = () => {
        if(likeBtn.classList.contains('liked')) {
            localStorage.removeItem(storageKey);
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '🤍 Like';
        } else {
            localStorage.setItem(storageKey, 'true');
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '❤️ Liked';
        }
    };

    document.getElementById('btn-share-article').onclick = () => {
        UX.share(viz.title, window.location.href);
    };
});
