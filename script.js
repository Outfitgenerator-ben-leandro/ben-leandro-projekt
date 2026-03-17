let currentUser = "";
let wardrobe = {
    Oberteil: [],
    Hose: [],
    Schuhe: []
};

// track which index is currently selected per category (for fixed boxes)
const wardrobeSelected = { Oberteil: 0, Hose: 0, Schuhe: 0 };

// handy DOM helper
const $ = (id) => document.getElementById(id);

// map wardrobe category -> image element id
const categoryToImgId = { Oberteil: 'shirt', Hose: 'pants', Schuhe: 'shoes' };
const categoryFieldColor = { Oberteil: '#e74c3c', Hose: '#3498db', Schuhe: '#2ecc71' };

function getCategoryDisplayName(category) {
    return {
        Oberteil: 'Oberteile',
        Hose: 'Hosen',
        Schuhe: 'Schuhe'
    }[category] || category;
}

function ensureWardrobeStructure() {
    if (!wardrobe || typeof wardrobe !== 'object') {
        wardrobe = {};
    }
    for (const category of ['Oberteil', 'Hose', 'Schuhe']) {
        if (!Array.isArray(wardrobe[category])) {
            wardrobe[category] = [];
        }
    }
}

function removeLegacyLabelFromSvgDataUrl(src) {
    if (typeof src !== 'string' || !src.startsWith('data:image/svg+xml')) return src;
    const commaIndex = src.indexOf(',');
    if (commaIndex < 0) return src;

    const prefix = src.slice(0, commaIndex + 1);
    const encoded = src.slice(commaIndex + 1);
    let svg = '';
    try {
        svg = decodeURIComponent(encoded);
    } catch (e) {
        return src;
    }

    const hasLegacyLabel = /(Shirt|Pants|Shoes|Oberteil|Hose|Schuhe)\s*\d+/i.test(svg);
    if (!hasLegacyLabel) return src;

    const cleanedSvg = svg.replace(/<text[\s\S]*?<\/text>/gi, '');
    return prefix + encodeURIComponent(cleanedSvg);
}

function normalizeLegacyWardrobeLabels() {
    for (const category of Object.keys(wardrobe)) {
        wardrobe[category] = (wardrobe[category] || [])
            .map(removeLegacyLabelFromSvgDataUrl)
            .map((src) => normalizeStarterFieldToCategoryColor(category, src));
    }
}

function normalizeStarterFieldToCategoryColor(category, src) {
    if (typeof src !== 'string' || !src.startsWith('data:image/svg+xml;charset=utf-8,')) return src;
    const commaIndex = src.indexOf(',');
    if (commaIndex < 0) return src;

    const prefix = src.slice(0, commaIndex + 1);
    const encoded = src.slice(commaIndex + 1);
    let svg = '';
    try {
        svg = decodeURIComponent(encoded);
    } catch (e) {
        return src;
    }

    if (!/<desc>\d{13}-[a-z0-9]{8}<\/desc>/i.test(svg)) return src;
    const categoryColor = categoryFieldColor[category];
    if (!categoryColor) return src;
    const updatedSvg = svg.replace(/fill='[^']*'/i, `fill='${categoryColor}'`);
    if (updatedSvg === svg) return src;
    return prefix + encodeURIComponent(updatedSvg);
}

function login() {
    const name = document.getElementById("username").value.trim();
    if (!name) {
        alert("Bitte gib deinen Namen ein!");
        return;
    }
    currentUser = name;
    const savedData = localStorage.getItem(currentUser);
    if (savedData) {
        wardrobe = JSON.parse(savedData);
    }
    ensureWardrobeStructure();
    normalizeLegacyWardrobeLabels();
    const addedOnLogin = ensureMinimumStarterFieldsPerCategory(15);
    if (addedOnLogin > 0) {
        localStorage.setItem(currentUser, JSON.stringify(wardrobe));
    }
    document.getElementById("welcome").innerText =
        "Willkommen " + name + " in unserem Outfit-Generator!";
    document.getElementById("app").classList.remove("hidden");
    displayOutfit();
    renderGallery();
}

// called from the start screen
function startFromScreen(){
    const name = document.getElementById('startName').value.trim();
    if(!name){ alert('Bitte gib deinen Namen ein!'); return; }
    // copy into hidden username field and reuse login()
    document.getElementById('username').value = name;
    // hide start screen
    const s = document.getElementById('startScreen');
    if(s) s.classList.add('hidden');
    login();
}

function saveWardrobe() {
    const key = currentUser || 'wardrobe_demo';
    localStorage.setItem(key, JSON.stringify(wardrobe));
    renderGallery();
}

let _removeBgLoaderPromise = null;

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function getRemoveBackgroundFn() {
    if (typeof window._removeBg === 'function') {
        return window._removeBg;
    }

    if (!_removeBgLoaderPromise) {
        _removeBgLoaderPromise = (async () => {
            const moduleUrl = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser/index.js';
            const modelPath = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser/';
            const mod = await import(moduleUrl);
            const removeBackground = mod.default || mod.removeBackground;
            if (typeof removeBackground !== 'function') {
                throw new Error('Background removal module did not expose a function.');
            }
            return async (sourceDataUrl) => {
                const result = await removeBackground(sourceDataUrl, { publicPath: modelPath });
                const blob = result instanceof Blob ? result : new Blob([result], { type: 'image/png' });
                return blobToDataUrl(blob);
            };
        })();
    }

    try {
        return await _removeBgLoaderPromise;
    } catch (err) {
        _removeBgLoaderPromise = null;
        throw err;
    }
}

async function cutOutBackground(dataUrl) {
    const removeBg = await getRemoveBackgroundFn();
    return removeBg(dataUrl);
}

function isDuplicatePiece(category, imageSrc) {
    return (wardrobe[category] || []).includes(imageSrc);
}

function addPieceIfUnique(category, imageSrc) {
    if (isDuplicatePiece(category, imageSrc)) return false;
    wardrobe[category].push(imageSrc);
    return true;
}

function updateGalleryAddButtonColor() {
    const select = document.getElementById('galleryCategory');
    const btn = document.getElementById('galleryAddBtn');
    if (!select || !btn) return;
    const buttonColor = {
        Oberteil: '#e74c3c',
        Hose: '#3498db',
        Schuhe: '#2ecc71'
    }[select.value] || '#3498db';
    btn.style.background = buttonColor;
    btn.style.borderColor = buttonColor;
    btn.style.color = '#fff';
}

function updateMainCategoryFieldColor() {
    const select = document.getElementById('category');
    if (!select) return;
    const fieldColor = categoryFieldColor[select.value] || '#3498db';
    select.style.background = fieldColor;
    select.style.borderColor = fieldColor;
    select.style.color = '#fff';
}

function createColorFieldDataUrl(color) {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='${color}'/><desc>${uniqueId}</desc></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function getWardrobeItemCount() {
    return (wardrobe.Oberteil || []).length + (wardrobe.Hose || []).length + (wardrobe.Schuhe || []).length;
}

function addStarterFieldsToCategory(category, countToAdd) {
    const color = categoryFieldColor[category] || '#7df9b6';
    for (let i = 0; i < countToAdd; i++) {
        wardrobe[category].push(createColorFieldDataUrl(color));
    }
}

function isStarterFieldDataUrl(src) {
    if (typeof src !== 'string' || !src.startsWith('data:image/svg+xml;charset=utf-8,')) return false;
    const commaIndex = src.indexOf(',');
    if (commaIndex < 0) return false;

    try {
        const svg = decodeURIComponent(src.slice(commaIndex + 1));
        return /<desc>\d{13}-[a-z0-9]{8}<\/desc>/i.test(svg);
    } catch (e) {
        return false;
    }
}

function ensureMinimumStarterFieldsPerCategory(minPerCategory = 15) {
    let changedTotal = 0;

    for (const category of ['Oberteil', 'Hose', 'Schuhe']) {
        const previousItems = Array.isArray(wardrobe[category]) ? wardrobe[category] : [];
        const starterItems = previousItems
            .map(removeLegacyLabelFromSvgDataUrl)
            .map((src) => normalizeStarterFieldToCategoryColor(category, src))
            .filter(isStarterFieldDataUrl)
            .slice(0, minPerCategory);

        while (starterItems.length < minPerCategory) {
            starterItems.push(createColorFieldDataUrl(categoryFieldColor[category] || '#7df9b6'));
        }

        const unchanged =
            previousItems.length === starterItems.length &&
            previousItems.every((item, index) => item === starterItems[index]);

        if (!unchanged) {
            changedTotal++;
        }

        wardrobe[category] = starterItems;
        wardrobeSelected[category] = Math.min(wardrobeSelected[category] || 0, starterItems.length - 1);
    }

    return changedTotal;
}

function addGalleryField() {
    const categorySelect = document.getElementById('galleryCategory');
    const mainCategory = document.getElementById('category');
    const category = categorySelect ? categorySelect.value : (mainCategory ? mainCategory.value : 'Oberteil');
    const color = categoryFieldColor[category] || '#7df9b6';
    const fieldSrc = createColorFieldDataUrl(color);

    if (!addPieceIfUnique(category, fieldSrc)) {
        alert("Dieses Kleidungsstück ist bereits in der Kategorie vorhanden.");
        return;
    }

    if (mainCategory) {
        mainCategory.value = category;
        updateMainCategoryFieldColor();
    }
    saveWardrobe();
    displayOutfit();
}

async function processFilesForCategory(category, files) {
    let addedCount = 0;
    let duplicateCount = 0;

    for (const file of files) {
        const dataUrl = await fileToDataUrl(file);
        let candidateSrc = dataUrl;
        try {
            const cutout = await cutOutBackground(dataUrl);
            candidateSrc = cutout;
        } catch (err) {
            console.warn('AI cutout failed for one file. Using original image.', err);
            candidateSrc = dataUrl;
        }
        if (addPieceIfUnique(category, candidateSrc)) {
            addedCount++;
        } else {
            duplicateCount++;
        }
    }

    return { addedCount, duplicateCount };
}

async function addMultipleItems() {
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("imageUpload");
    const files = Array.from(fileInput.files);
    if (!files.length) return;

    const { addedCount, duplicateCount } = await processFilesForCategory(category, files);

    if (addedCount > 0) {
        saveWardrobe();
        displayOutfit();
    }
    if (duplicateCount > 0) {
        alert(`${duplicateCount} Stück wurde(n) nicht hinzugefügt, weil es bereits vorhanden ist.`);
    }
    fileInput.value = "";
}

async function addItem() {
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("imageUpload");

    if (!fileInput.files[0]) {
        alert("Bitte ein Bild auswählen");
        return;
    }

    const dataUrl = await fileToDataUrl(fileInput.files[0]);
    let candidateSrc = dataUrl;
    try {
        const cutout = await cutOutBackground(dataUrl);
        candidateSrc = cutout;
    } catch (err) {
        console.warn('AI cutout failed. Using original image.', err);
        candidateSrc = dataUrl;
    }
    if (!addPieceIfUnique(category, candidateSrc)) {
        alert("Dieses Kleidungsstück ist bereits in der Kategorie vorhanden.");
        fileInput.value = "";
        return;
    }

    saveWardrobe();
    displayOutfit();
    fileInput.value = "";
}

function generateOutfit() {
    if (
        wardrobe.Oberteil.length === 0 ||
        wardrobe.Hose.length === 0 ||
        wardrobe.Schuhe.length === 0
    ) {
        alert("Bitte füge Kleidung zu allen Kategorien hinzu!");
        return;
    }
    displayOutfit();
}

function displayOutfit() {
    // pick a random item per category (if available) and set the corresponding image
    for (const cat of ['Oberteil', 'Hose', 'Schuhe']) {
        const arr = wardrobe[cat] || [];
        const img = $(categoryToImgId[cat]);
        if (!img) continue;
        img.src = arr.length ? randomItem(arr) : '';
    }
    // ensure drag handlers attached in case elements exist
    attachDragHandlers();
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function startGenerator() {
    generateOutfit();
}

function toggleEdit() {
    const panel = document.getElementById("editPanel");
    if (panel.classList.contains("hidden")) {
        showEdit();
        panel.classList.remove("hidden");
    } else {
        panel.classList.add("hidden");
    }
}

function showEdit() {
    const editContent = document.getElementById("editContent");
    editContent.innerHTML = "";
    for (const category in wardrobe) {
        wardrobe[category].forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "edit-item";
            itemDiv.innerHTML = `<div><img src="${item}"></div><button onclick="deleteItem('${category}', ${index})">Löschen</button>`;
            editContent.appendChild(itemDiv);
        });
    }
}

function deleteItem(category, index) {
    wardrobe[category].splice(index, 1);
    saveWardrobe();
    displayOutfit();
    showEdit();
}

function prevItem(category){
    const len = (wardrobe[category] || []).length;
    if(len===0) return;
    wardrobeSelected[category] = (wardrobeSelected[category] - 1 + len) % len;
    setMainImage(category, wardrobeSelected[category]);
    renderGallery();
}

function nextItem(category){
    const len = (wardrobe[category] || []).length;
    if(len===0) return;
    wardrobeSelected[category] = (wardrobeSelected[category] + 1) % len;
    setMainImage(category, wardrobeSelected[category]);
    renderGallery();
}

// Try loading demo wardrobe on startup if present
(() => {
    try {
        const saved = localStorage.getItem('wardrobe_demo');
        if (saved) {
            wardrobe = JSON.parse(saved);
        }
        ensureWardrobeStructure();
        normalizeLegacyWardrobeLabels();
        const addedOnStartup = ensureMinimumStarterFieldsPerCategory(15);
        if (addedOnStartup > 0) {
            localStorage.setItem('wardrobe_demo', JSON.stringify(wardrobe));
        }
        // keep at least 15 starter fields available
    } catch (e) {
        console.warn('Could not load saved wardrobe demo', e);
    }
})();

// Add simple SVG sample items so the generator can be tried without uploads
function addSampleWardrobe() {
    ensureMinimumStarterFieldsPerCategory(15);

    saveWardrobe();
    displayOutfit();
}

function removeGalleryItem(category, index) {
    const items = wardrobe[category] || [];
    if (index < 0 || index >= items.length) return;
    const confirmed = confirm(`${getCategoryDisplayName(category)} #${index + 1} löschen?`);
    if (!confirmed) return;

    items.splice(index, 1);
    const maxIndex = Math.max(0, items.length - 1);
    if (wardrobeSelected[category] > maxIndex) {
        wardrobeSelected[category] = maxIndex;
    }

    saveWardrobe();
    displayOutfit();
}

// Render the clothing gallery in #galleryContent
function renderGallery(){
    const container = document.getElementById('galleryContent');
    const title = document.getElementById('galleryTitle');
    if(!container) return;
    container.innerHTML = '';
    const totalCount = getWardrobeItemCount();
    if (title) title.innerText = `Kleidungs-Galerie (${totalCount})`;
    for(const category of ['Oberteil','Hose','Schuhe']){
        const catDiv = document.createElement('div');
        catDiv.className = 'cat';
        const label = document.createElement('div');
        label.className = 'cat-label';
        label.innerText = getCategoryDisplayName(category);
        const thumbs = document.createElement('div');
        thumbs.className = 'thumbs';
        (wardrobe[category]||[]).forEach((src, idx)=>{
            const t = document.createElement('div');
            t.className = 'thumb';
            t.title = `${getCategoryDisplayName(category)} #${idx + 1} (klicken zum Löschen)`;
            t.onclick = ()=> removeGalleryItem(category, idx);
            const img = document.createElement('img'); img.src = src;
            t.appendChild(img);
            const badge = document.createElement('span');
            badge.className = 'thumb-index';
            badge.innerText = `${idx + 1}`;
            t.appendChild(badge);
            // (remove button intentionally omitted)
            thumbs.appendChild(t);
        });
        catDiv.appendChild(label);
        catDiv.appendChild(thumbs);
        container.appendChild(catDiv);
    }
}

// Set the outfit image to a chosen gallery item
function setMainImage(category, index){
    const src = wardrobe[category] && wardrobe[category][index];
    if (!src) return;
    const id = categoryToImgId[category];
    const img = $(id);
    if (img) img.src = src;
}

function toggleFrame() {
    const area = document.getElementById('outfitArea');
    if (!area) return;
    area.classList.toggle('no-frame');
}

// Sticker cycling: show/hide and change designs
let _stickerIndex = -1;
const _stickers = [
    { text: 'NEU', bg: 'linear-gradient(90deg,#ff0078,#ff6a00)', color: '#fff', rotate: -8 },
    { text: 'LIMITIERT', bg: 'linear-gradient(90deg,#00ffd5,#00b4ff)', color: '#000', rotate: -6 },
    { text: '🔥 HEISS', bg: '#111', color: '#fff', rotate: -12 }
];

function cycleSticker() {
    const el = document.getElementById('sticker');
    if (!el) return;
    _stickerIndex = (_stickerIndex + 1) % (_stickers.length + 1);
    if (_stickerIndex === _stickers.length) {
        el.style.display = 'none';
        return;
    }
    const s = _stickers[_stickerIndex];
    el.style.display = 'block';
    el.innerText = s.text;
    el.style.background = s.bg;
    el.style.color = s.color;
    el.style.transform = `rotate(${s.rotate}deg)`;
}

// --- Drag & drop for clothing elements inside #outfitArea ---
function attachDragHandlers(){
    const items = document.querySelectorAll('#outfitArea .clothing');
    items.forEach(el => {
        if (el._dragAttached) return;
        el._dragAttached = true;
        el.style.position = 'absolute';
        el.style.touchAction = 'none';
        let dragging = false, startX=0, startY=0, origLeft=0, origTop=0;
        el.addEventListener('pointerdown', (ev) => {
            ev.preventDefault();
            el.setPointerCapture(ev.pointerId);
            dragging = true;
            startX = ev.clientX; startY = ev.clientY;
            origLeft = parseFloat(el.style.left) || el.offsetLeft || 0;
            origTop = parseFloat(el.style.top) || el.offsetTop || 0;
            el.classList.add('dragging');
        });
        el.addEventListener('pointermove', (ev) => {
            if (!dragging) return;
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            el.style.left = (origLeft + dx) + 'px';
            el.style.top = (origTop + dy) + 'px';
        });
        el.addEventListener('pointerup', (ev) => {
            if (!dragging) return;
            dragging = false;
            try { el.releasePointerCapture(ev.pointerId); } catch(e){}
            el.classList.remove('dragging');
            saveWardrobe();
        });
    });
}

// --- Glitch effect ---
function glitchOutfit(){
    const imgs = document.querySelectorAll('#outfitArea .clothing');
    imgs.forEach(i=> i.classList.add('glitch'));
    setTimeout(()=> imgs.forEach(i=> i.classList.remove('glitch')), 900);
}

// --- Download current outfit as PNG by compositing images onto a canvas ---
function downloadOutfit(){
    const area = document.getElementById('outfitArea');
    if(!area) return;
    const w = area.clientWidth, h = area.clientHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    // fill background
    ctx.fillStyle = window.getComputedStyle(area).backgroundColor || '#070707';
    ctx.fillRect(0,0,w,h);
    const images = ['shirt','pants','shoes'].map(id=>document.getElementById(id)).filter(Boolean);
    let toLoad = images.length; if(toLoad===0){ finish(); }
    images.forEach(imgEl => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const left = parseFloat(imgEl.style.left) || imgEl.offsetLeft || 0;
            const top = parseFloat(imgEl.style.top) || imgEl.offsetTop || 0;
            const dw = imgEl.clientWidth || img.width;
            const dh = imgEl.clientHeight || img.height;
            ctx.drawImage(img, left, top, dw, dh);
            toLoad--; if(toLoad===0) finish();
        };
        img.onerror = () => { toLoad--; if(toLoad===0) finish(); };
        img.src = imgEl.src;
    });
    function finish(){
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a'); a.href = url; a.download = 'outfit.png'; a.click();
    }
}

// Toggle gallery visibility with a single click
function toggleGallery(){
    const gallery = document.getElementById('gallery');
    const btn = document.getElementById('toggleGalleryBtn');
    const layout = document.querySelector('.layout');
    const app = document.getElementById('app');
    if(!gallery || !layout || !app) return;
    const opening = !app.classList.contains('gallery-open');
    if(opening){
        const addedOnOpen = ensureMinimumStarterFieldsPerCategory(15);
        if (addedOnOpen > 0) {
            saveWardrobe();
        } else {
            renderGallery();
        }
        app.classList.add('gallery-open');
        gallery.classList.remove('hidden');
        const galleryCategory = document.getElementById('galleryCategory');
        const mainCategory = document.getElementById('category');
        if (galleryCategory && mainCategory) {
            galleryCategory.value = mainCategory.value;
        }
        updateGalleryAddButtonColor();
        // override inline sizing so CSS full-screen rules apply
        gallery._prevInline = {
            display: gallery.style.display || '',
            flexDirection: gallery.style.flexDirection || '',
            position: gallery.style.position || '',
            width: gallery.style.width || '',
            height: gallery.style.height || '',
            left: gallery.style.left || '',
            top: gallery.style.top || '',
            padding: gallery.style.padding || '',
            boxSizing: gallery.style.boxSizing || '',
            overflow: gallery.style.overflow || '',
            zIndex: gallery.style.zIndex || ''
        };
        gallery.style.display = 'flex';
        gallery.style.flexDirection = 'column';
        gallery.style.position = 'fixed';
        gallery.style.left = '0';
        gallery.style.top = '0';
        gallery.style.width = '100vw';
        gallery.style.height = '100vh';
        gallery.style.padding = '20px';
        gallery.style.boxSizing = 'border-box';
        gallery.style.overflow = 'hidden';
        gallery.style.zIndex = '50';
        document.body.style.overflow = 'hidden';
        if(btn) btn.innerText = 'Galerie schließen';
    } else {
        app.classList.remove('gallery-open');
        // restore inline styles so gallery is visible in normal layout
        if (gallery._prevInline) {
            gallery.style.display = gallery._prevInline.display;
            gallery.style.flexDirection = gallery._prevInline.flexDirection;
            gallery.style.position = gallery._prevInline.position;
            gallery.style.width = gallery._prevInline.width;
            gallery.style.height = gallery._prevInline.height;
            gallery.style.left = gallery._prevInline.left;
            gallery.style.top = gallery._prevInline.top;
            gallery.style.padding = gallery._prevInline.padding;
            gallery.style.boxSizing = gallery._prevInline.boxSizing;
            gallery.style.overflow = gallery._prevInline.overflow;
            gallery.style.zIndex = gallery._prevInline.zIndex;
            delete gallery._prevInline;
        }
        gallery.classList.add('hidden');
        document.body.style.overflow = '';
        if(btn) btn.innerText = 'Galerie öffnen';
    }
}

// attach handlers on initial load
document.addEventListener('DOMContentLoaded', () => attachDragHandlers());

// Ensure start screen input and button behave: focus, Enter key, and click wiring
document.addEventListener('DOMContentLoaded', () => {
    const startInput = document.getElementById('startName');
    const startBtn = document.getElementById('startBtn');
    const mainCategory = document.getElementById('category');
    if (startInput) startInput.focus();
    if (startInput) {
        startInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') startFromScreen();
        });
    }
    if (startBtn) {
        // ensure clicking the button triggers the same flow
        startBtn.addEventListener('click', (e) => { e.preventDefault(); startFromScreen(); });
    }
    if (mainCategory) {
        mainCategory.addEventListener('change', updateMainCategoryFieldColor);
    }
    updateMainCategoryFieldColor();
    updateGalleryAddButtonColor();
    // initial render of gallery if present
    renderGallery();
});
