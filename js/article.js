import { Theme, Data, UX } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    Theme.init();

    const id = new URLSearchParams(window.location.search).get('id');
    const data = await Data.fetch();
    const viz = data?.visualizations.find(v => String(v.id) === id);

    if (!viz) return;

    // SEO & social metadata
    document.title = `${viz.title} | Geo-Bits`;

    document.getElementById('page-description').setAttribute(
        'content',
        viz.preview || viz.detailContent?.description || ''
    );

    const canonicalUrl = `${window.location.origin}/article.html?id=${viz.id}`;
    document.getElementById('canonical-url').setAttribute('href', canonicalUrl);

    // OpenGraph
    document.getElementById('og-title').setAttribute('content', viz.title);
    document.getElementById('og-description').setAttribute(
        'content',
        viz.preview || ''
    );
    document.getElementById('og-image').setAttribute('content', viz.imageUrl);

    // Twitter
    document.getElementById('twitter-title').setAttribute('content', viz.title);
    document.getElementById('twitter-description').setAttribute(
        'content',
        viz.preview || ''
    );
    document.getElementById('twitter-image').setAttribute('content', viz.imageUrl);


    // Render Article
    document.title = viz.title;
    document.getElementById('art-cat').textContent = viz.category;
    document.getElementById('art-title').textContent = viz.title;
    const dateEl = document.getElementById('art-date');
    if (viz.published && dateEl) {
        dateEl.textContent = `Published on ${viz.published}`;
    }
    document.getElementById('art-img').src = viz.imageUrl;
    const descEl = document.getElementById('art-desc');
    descEl.innerHTML = '';

    const rawDesc = viz.detailContent?.description || viz.preview || '';
    const paragraphs = rawDesc.split(/\n\s*\n/);

    paragraphs.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text.trim();
        descEl.appendChild(p);
    });
    const sourcesEl = document.getElementById('art-sources');
    const sources = viz.detailContent?.sources;

    if (sourcesEl) {
        if (Array.isArray(sources) && sources.length > 0) {
            sourcesEl.innerHTML = `<strong>Sources:</strong>
            <ul style="padding-left:20px; margin-top:8px;">
                ${sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>`).join('')}
            </ul>`;
        } else {
            sourcesEl.innerHTML = `<strong>Sources:</strong> Not specified.`;
        }
    }

    // --- Dynamic Author Logic (Fix) ---
    const authorName = viz.author || "Somesh Kota";
    const authorRole = viz.authorRole || "Founder & Analyst";
    const initials = authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

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

    if (localStorage.getItem(storageKey)) {
        likeBtn.classList.add('liked');
        likeBtn.innerHTML = '❤️ Liked';
    }

    likeBtn.onclick = () => {
        if (likeBtn.classList.contains('liked')) {
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
