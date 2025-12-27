import { ThemeSystem, DataService, UX } from './utils.js';
let state = { visuals: [], currentIndex: 0 };

document.addEventListener('DOMContentLoaded', async () => {
    ThemeSystem.init();
    const data = await DataService.fetchAll();
    if (data && data.visualizations) {
        state.visuals = data.visualizations;
        initGallery();
    }
});

function initGallery() {
    renderSpotlight();
    renderFilmstrip();
    
    document.getElementById('prev-btn').onclick = () => changeSlide(-1);
    document.getElementById('next-btn').onclick = () => changeSlide(1);
}

function renderSpotlight() {
    const viz = state.visuals[state.currentIndex];
    const viewport = document.getElementById('spotlight-viewport');
    const meta = document.getElementById('spotlight-meta');
    
    viewport.style.opacity = 0;
    setTimeout(() => {
        viewport.innerHTML = `<img src="${viz.imageUrl}" class="spotlight-img" style="width:100%; height:100%; object-fit:contain;" alt="${viz.title}">`;
        
        meta.innerHTML = `
            <span class="badge">${viz.category}</span>
            <h2 class="text-gradient" style="margin-top:12px;">${viz.title}</h2>
            <p style="margin-top:12px; color:var(--text-muted);">${viz.preview}</p>
            <div class="meta-actions">
                <a href="article.html?id=${viz.id}" class="btn btn-primary btn-full" style="text-align:center;">Read Analysis</a>
                <button id="btn-dl-gal" class="btn btn-outline btn-full" style="margin-top:12px;">Download</button>
            </div>
        `;
        document.getElementById('btn-dl-gal').onclick = () => UX.downloadImage(viz.imageUrl, viz.title);
        viewport.style.opacity = 1;
    }, 200);
    
    updateActiveFilmstrip();
}

function renderFilmstrip() {
    const strip = document.getElementById('filmstrip');
    strip.innerHTML = state.visuals.map((v, idx) => `
        <img src="${v.imageUrl}" class="filmstrip-item ${idx === state.currentIndex ? 'active' : ''}" 
             onclick="window.switchSlide(${idx})" alt="Thumb">
    `).join('');
    window.switchSlide = (idx) => { state.currentIndex = idx; renderSpotlight(); };
}

function changeSlide(dir) {
    const len = state.visuals.length;
    state.currentIndex = (state.currentIndex + dir + len) % len;
    renderSpotlight();
}

function updateActiveFilmstrip() {
    document.querySelectorAll('.filmstrip-item').forEach((el, idx) => {
        if (idx === state.currentIndex) el.classList.add('active');
        else el.classList.remove('active');
    });
}
