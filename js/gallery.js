import { Theme, Data, UX } from './utils.js';

let visuals = [];
let index = 0;

document.addEventListener('DOMContentLoaded', async () => {
    Theme.init();
    const data = await Data.fetch();
    if(data) {
        visuals = data.visualizations;
        updateView();
    }
    
    document.getElementById('prev').onclick = () => { index = (index - 1 + visuals.length) % visuals.length; updateView(); };
    document.getElementById('next').onclick = () => { index = (index + 1) % visuals.length; updateView(); };
});

function updateView() {
    const v = visuals[index];
    const vp = document.getElementById('viewport');
    
    vp.style.opacity = 0.5;
    setTimeout(() => {
        vp.innerHTML = `<img src="${v.imageUrl}" class="spotlight-img">`;
        vp.style.opacity = 1;
    }, 150);

    document.getElementById('meta').innerHTML = `
        <span class="badge">${v.category}</span>
        <h2 style="margin:12px 0;">${v.title}</h2>
        <p style="color:var(--text-muted);">${v.preview}</p>
        <div style="display:flex; gap:12px; margin-top:24px;">
            <a href="article.html?id=${v.id}" class="btn btn-primary">Read Analysis</a>
            <button id="dl-btn" class="btn btn-outline">Download</button>
        </div>
    `;
    document.getElementById('dl-btn').onclick = () => UX.download(v.imageUrl, v.title);
}
