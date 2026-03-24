let currentUser = "";
let wardrobe = {
    Oberteil: [],
    Hose: [],
    Schuhe: []
};

function createEmptyTrashBin() {
    return {
        Oberteil: [],
        Hose: [],
        Schuhe: []
    };
}

let trashBin = createEmptyTrashBin();
let outfitFeedback = { likes: {}, dislikes: {} };
let lastGeneratedOutfitSelection = null;

// track which index is currently selected per category (for fixed boxes)
const wardrobeSelected = { Oberteil: 0, Hose: 0, Schuhe: 0 };

// handy DOM helper
const $ = (id) => document.getElementById(id);

// map wardrobe category -> image element id
const categoryToImgId = { Oberteil: 'shirt', Hose: 'pants', Schuhe: 'shoes' };
const categoryFieldColor = { Oberteil: '#e74c3c', Hose: '#3498db', Schuhe: '#2ecc71' };

const translations = {
    de: {
        startHeading: 'Gib deinen Namen ein', startPlaceholder: 'Dein Name', startBtn: 'Start',
        appTitle: 'Outfit Generator',
        welcomeText: (name) => `Willkommen ${name} in unserem Outfit Generator!`,
        alertEnterName: 'Bitte gib deinen Namen ein!',
        btnGenerate: 'Outfit erstellen', btnDownload: 'Outfit herunterladen',
        btnLikeOutfit: 'Gefällt mir', btnDislikeOutfit: 'Gefällt mir nicht',
        btnGalleryOpen: 'Galerie öffnen', btnGalleryClose: 'Galerie schließen',
        btnAbout: 'Über uns', btnGuide: 'Anleitung', guideTitle: 'Anleitung', labelCategory: 'Kategorie:',
        btnFeedback: 'Fehler / Verbesserung melden',
        catOberteil: 'Oberteile', catHose: 'Hosen', catSchuhe: 'Schuhe',
        btnAddItem: 'Kleidungsstück hinzufügen', aboutTitle: 'Über uns', btnClose: 'Schließen',
        galleryTitle: (n) => `Kleidungs-Galerie (${n})`, trashTitle: (n) => `Papierkorb (${n})`,
        btnChooseFile: 'Dateien auswählen',
        btnTrashClear: 'Alle dauerhaft löschen', btnAddField: 'Feld hinzufügen', langLabel: 'Sprache',
        alertChooseFilesFirst: 'Bitte wähle zuerst mindestens eine Datei aus.',
        alertRateNoOutfit: 'Bitte erst ein Outfit erstellen.',
        alertRatedLike: 'Danke! Wir merken uns, was dir gefällt.',
        alertRatedDislike: 'Danke! Wir vermeiden solche Kombinationen künftig eher.',
        aboutText: [
            'Wir heißen Ben und Leandro. Diese Webseite ist unser Abschlussprojekt in der 9. Klasse. Wir wollten ein Projekt bauen, das nützlich ist und gleichzeitig Spaß macht. Deshalb haben wir den Outfit-Generator entwickelt. Mit ihm kann man verschiedene Kleidungsstücke testen, kombinieren und direkt sehen, wie ein Outfit zusammen aussieht.',
            'Auf der Webseite kannst du eigene Bilder hochladen und sie den Kategorien Oberteil, Hose und Schuhe zuordnen. Die Seite versucht, die Kleidungsstücke sauber freizustellen, damit keine störenden Blöcke zu sehen sind. Danach kannst du die Teile verschieben, neue Kombinationen ausprobieren und dein Ergebnis als Bild herunterladen.',
            'Uns war wichtig, dass die Bedienung einfach ist. Man soll nicht lange suchen müssen, sondern direkt starten können. Darum haben wir klare Buttons, eine übersichtliche Galerie und einen Papierkorb eingebaut. So kann man Bilder hinzufügen, verwalten und bei Bedarf wiederherstellen.',
            'In dieses Projekt sind viele Stunden Arbeit geflossen. Wir haben geplant, getestet, Fehler verbessert und das Design Schritt für Schritt angepasst. Dabei haben wir gelernt, wie man HTML, CSS und JavaScript zusammen einsetzt, damit eine Idee zu einer echten Webseite wird. Gleichzeitig ist dieses Projekt unsere erste Erfahrung mit dem Programmieren.',
            'Unser Ziel ist, dass unsere Seite kreativem Arbeiten hilft und Lust auf Technik macht. Wir freuen uns, wenn du den Outfit-Generator nutzt und eigene Styles ausprobierst.',
        ],
        guideText: [
            'So benutzt du den Outfit-Generator Schritt für Schritt:',
            'Wähle zuerst auf dem Startbildschirm deine Sprache und gib danach deinen Namen ein. Klicke dann auf Start.',
            'Wähle eine Kategorie (Oberteil, Hose oder Schuhe), lade Bilder hoch und klicke auf „Kleidungsstück hinzufügen“.',
            'Öffne bei Bedarf die Galerie, um Felder hinzuzufügen oder vorhandene Bilder zu löschen.',
            'Klicke auf „Outfit erstellen“, verschiebe die Teile per Drag & Drop und speichere das Ergebnis mit „Outfit herunterladen“.',
            'Bewerte ein Outfit mit 👍 oder 👎, damit zukünftige Vorschläge besser zu deinem Stil passen.'
        ],
    },
    en: {
        startHeading: 'Enter your name', startPlaceholder: 'Your name', startBtn: 'Start',
        appTitle: 'Outfit Generator',
        welcomeText: (name) => `Welcome ${name} to our Outfit Generator!`,
        alertEnterName: 'Please enter your name!',
        btnGenerate: 'Create outfit', btnDownload: 'Download outfit',
        btnLikeOutfit: 'Like outfit', btnDislikeOutfit: 'Dislike outfit',
        btnGalleryOpen: 'Open gallery', btnGalleryClose: 'Close gallery',
        btnAbout: 'About us', btnGuide: 'Guide', guideTitle: 'Guide', labelCategory: 'Category:',
        btnFeedback: 'Report error / suggestion',
        catOberteil: 'Tops', catHose: 'Pants', catSchuhe: 'Shoes',
        btnAddItem: 'Add clothing item', aboutTitle: 'About us', btnClose: 'Close',
        galleryTitle: (n) => `Clothing gallery (${n})`, trashTitle: (n) => `Trash (${n})`,
        btnChooseFile: 'Choose files',
        btnTrashClear: 'Delete all permanently', btnAddField: 'Add field', langLabel: 'Language',
        alertChooseFilesFirst: 'Please select at least one file first.',
        alertRateNoOutfit: 'Please generate an outfit first.',
        alertRatedLike: 'Thanks! We will remember what you like.',
        alertRatedDislike: 'Thanks! We will avoid similar combinations.',
        aboutText: [
            'We are Ben and Leandro. This website is our final project in 9th grade. We wanted to build something useful and fun at the same time. That is why we developed the Outfit Generator. With it you can try out different clothing items, combine them, and see directly how an outfit looks together.',
            'On the website you can upload your own images and assign them to the categories Top, Pants, and Shoes. The site tries to cleanly remove the background from the clothing so there are no distracting blocks visible. After that you can move the pieces around, try new combinations, and download your result as an image.',
            'It was important to us that the interface is easy to use. You should not have to search for long, but be able to start right away. That is why we built clear buttons, a clear gallery, and a trash bin. This way you can add, manage, and restore images if needed.',
            'Many hours of work went into this project. We planned, tested, fixed errors, and adjusted the design step by step. In the process we learned how HTML, CSS and JavaScript work together so that an idea becomes a real website. At the same time, this project is our first experience with programming.',
            'Our goal is for our site to help with creative work and inspire interest in technology. We hope you enjoy using the Outfit Generator and trying out your own styles.',
        ],
        guideText: [
            'How to use the Outfit Generator step by step:',
            'First choose your language on the start screen, then enter your name and click Start.',
            'Choose a category (Top, Pants, or Shoes), upload images, and click “Add clothing item”.',
            'Open the gallery if needed to add fields or remove existing images.',
            'Click “Create outfit”, move items via drag & drop, and save the result with “Download outfit”.',
            'Rate an outfit with 👍 or 👎 so future suggestions match your style better.'
        ],
    },
    fr: {
        startHeading: 'Entrez votre prénom', startPlaceholder: 'Votre prénom', startBtn: 'Démarrer',
        appTitle: 'Générateur de tenue',
        welcomeText: (name) => `Bienvenue ${name} dans notre générateur de tenue !`,
        alertEnterName: 'Veuillez entrer votre nom !',
        btnGenerate: 'Créer une tenue', btnDownload: 'Télécharger la tenue',
        btnLikeOutfit: 'J’aime cette tenue', btnDislikeOutfit: 'Je n’aime pas cette tenue',
        btnGalleryOpen: 'Ouvrir la galerie', btnGalleryClose: 'Fermer la galerie',
        btnAbout: 'À propos', btnGuide: 'Guide', guideTitle: 'Guide', labelCategory: 'Catégorie :',
        btnFeedback: 'Signaler une erreur / suggestion',
        catOberteil: 'Hauts', catHose: 'Pantalons', catSchuhe: 'Chaussures',
        btnAddItem: 'Ajouter un vêtement', aboutTitle: 'À propos de nous', btnClose: 'Fermer',
        galleryTitle: (n) => `Galerie (${n})`, trashTitle: (n) => `Corbeille (${n})`,
        btnChooseFile: 'Choisir des fichiers',
        btnTrashClear: 'Tout supprimer définitivement', btnAddField: 'Ajouter un champ', langLabel: 'Langue',
        alertChooseFilesFirst: 'Veuillez d’abord sélectionner au moins un fichier.',
        alertRateNoOutfit: 'Veuillez d’abord générer une tenue.',
        alertRatedLike: 'Merci ! Nous retenons vos préférences.',
        alertRatedDislike: 'Merci ! Nous éviterons ce type de combinaison.',
        aboutText: [
            'Nous nous appelons Ben et Leandro. Ce site web est notre projet de fin d\'année en 9e classe. Nous voulions créer quelque chose d\'utile et d\'amusant à la fois. C\'est pourquoi nous avons développé le Générateur de tenue. Avec lui, vous pouvez essayer différents vêtements, les combiner et voir directement comment une tenue s\'assemble.',
            'Sur le site, vous pouvez télécharger vos propres images et les attribuer aux catégories Haut, Pantalon et Chaussures. Le site essaie de détourer proprement les vêtements afin qu\'il n\'y ait pas de blocs gênants visibles. Ensuite, vous pouvez déplacer les pièces, essayer de nouvelles combinaisons et télécharger votre résultat sous forme d\'image.',
            'Il était important pour nous que l\'utilisation soit simple. On ne doit pas chercher longtemps, mais pouvoir commencer directement. C\'est pourquoi nous avons intégré des boutons clairs, une galerie claire et une corbeille. Ainsi, vous pouvez ajouter, gérer et restaurer des images si nécessaire.',
            'De nombreuses heures de travail ont été consacrées à ce projet. Nous avons planifié, testé, corrigé des erreurs et ajusté le design étape par étape. Ce faisant, nous avons appris comment utiliser HTML, CSS et JavaScript ensemble pour qu\'une idée devienne un vrai site web. En même temps, ce projet est notre première expérience avec la programmation.',
            'Notre objectif est que notre site aide au travail créatif et donne envie de s\'intéresser à la technologie. Nous espérons que vous utiliserez le Générateur de tenue et essaierez vos propres styles.',
        ],
        guideText: [
            'Comment utiliser le Générateur de tenue étape par étape :',
            'Choisissez d’abord la langue sur l’écran de départ, puis entrez votre prénom et cliquez sur Démarrer.',
            'Choisissez une catégorie (Haut, Pantalon ou Chaussures), importez des images puis cliquez sur « Ajouter un vêtement ».',
            'Ouvrez la galerie si nécessaire pour ajouter des champs ou supprimer des images existantes.',
            'Cliquez sur « Créer une tenue », déplacez les éléments par glisser-déposer puis enregistrez avec « Télécharger la tenue ».',
            'Évaluez une tenue avec 👍 ou 👎 pour améliorer les prochaines suggestions selon votre style.'
        ],
    },
    it: {
        startHeading: 'Inserisci il tuo nome', startPlaceholder: 'Il tuo nome', startBtn: 'Inizia',
        appTitle: 'Generatore di outfit',
        welcomeText: (name) => `Benvenuto sul nostro generatore di outfit`,
        alertEnterName: 'Per favore, inserisci il tuo nome!',
        btnGenerate: 'Crea outfit', btnDownload: 'Scarica outfit',
        btnLikeOutfit: 'Mi piace', btnDislikeOutfit: 'Non mi piace',
        btnGalleryOpen: 'Apri galleria', btnGalleryClose: 'Chiudi galleria',
        btnAbout: 'Chi siamo', btnGuide: 'Guida', guideTitle: 'Guida', labelCategory: 'Categoria:',
        btnFeedback: 'Segnala errore / suggerimento',
        catOberteil: 'Magliette', catHose: 'Pantaloni', catSchuhe: 'Scarpe',
        btnAddItem: 'Aggiungi capo', aboutTitle: 'Chi siamo', btnClose: 'Chiudi',
        galleryTitle: (n) => `Galleria (${n})`, trashTitle: (n) => `Cestino (${n})`,
        btnChooseFile: 'Scegli file',
        btnTrashClear: 'Elimina tutto definitivamente', btnAddField: 'Aggiungi campo', langLabel: 'Lingua',
        alertChooseFilesFirst: 'Seleziona prima almeno un file.',
        alertRateNoOutfit: 'Genera prima un outfit.',
        alertRatedLike: 'Grazie! Ricorderemo i tuoi gusti.',
        alertRatedDislike: 'Grazie! Eviteremo combinazioni simili.',
        aboutText: [
            'Ci chiamiamo Ben e Leandro. Questo sito web è il nostro progetto finale in 9° classe. Volevamo costruire qualcosa di utile e allo stesso tempo divertente. Per questo abbiamo sviluppato il Generatore di outfit. Con esso puoi provare diversi capi di abbigliamento, combinarli e vedere direttamente come appare un outfit.',
            'Sul sito puoi caricare le tue immagini e assegnarle alle categorie Maglietta, Pantaloni e Scarpe. Il sito cerca di rimuovere il sfondo dai capi in modo pulito, in modo che non siano visibili blocchi fastidiosi. Dopodiché puoi spostare i pezzi, provare nuove combinazioni e scaricare il risultato come immagine.',
            'Per noi era importante che l\'utilizzo fosse semplice. Non si deve cercare a lungo, ma poter iniziare subito. Per questo abbiamo inserito pulsanti chiari, una galleria chiara e un cestino. Così puoi aggiungere, gestire e ripristinare le immagini se necessario.',
            'In questo progetto sono state investite molte ore di lavoro. Abbiamo pianificato, testato, corretto errori e adattato il design passo dopo passo. In questo modo abbiamo imparato come usare HTML, CSS e JavaScript insieme affinché un\'idea diventi un vero sito web. Allo stesso tempo, questo progetto è la nostra prima esperienza con la programmazione.',
            'Il nostro obiettivo è che il nostro sito aiuti il lavoro creativo e faccia venire voglia di tecnologia. Siamo felici quando usi il Generatore di outfit e provi i tuoi stili.',
        ],
        guideText: [
            'Come usare il Generatore di outfit passo dopo passo:',
            'Scegli prima la lingua nella schermata iniziale, poi inserisci il tuo nome e clicca su Inizia.',
            'Scegli una categoria (Maglietta, Pantaloni o Scarpe), carica le immagini e clicca su « Aggiungi capo ».',
            'Apri la galleria se necessario per aggiungere campi o eliminare immagini esistenti.',
            'Clicca su « Crea outfit », sposta i capi con il drag & drop e salva il risultato con « Scarica outfit ».',
            'Valuta un outfit con 👍 o 👎 così i prossimi suggerimenti si adattano meglio al tuo stile.'
        ],
    },
};

let currentLang = localStorage.getItem('appLang') || 'de';

function t(key) {
    return (translations[currentLang] || translations.de)[key] || key;
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const val = t(el.getAttribute('data-i18n'));
        if (typeof val === 'string') el.innerText = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const val = t(el.getAttribute('data-i18n-placeholder'));
        if (typeof val === 'string') el.placeholder = val;
    });
    ['category', 'galleryCategory'].forEach((id) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.querySelectorAll('option').forEach((opt) => {
            if (opt.value === 'Oberteil') opt.innerText = t('catOberteil');
            else if (opt.value === 'Hose') opt.innerText = t('catHose');
            else if (opt.value === 'Schuhe') opt.innerText = t('catSchuhe');
        });
    });
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('lang-btn-active', btn.dataset.lang === lang);
    });
    const toggleBtn = document.getElementById('toggleGalleryBtn');
    if (toggleBtn) {
        const app = document.getElementById('app');
        toggleBtn.innerText = app && app.classList.contains('gallery-open')
            ? t('btnGalleryClose') : t('btnGalleryOpen');
    }
    const likeBtn = document.getElementById('outfitLikeBtn');
    if (likeBtn) {
        likeBtn.title = t('btnLikeOutfit');
        likeBtn.setAttribute('aria-label', t('btnLikeOutfit'));
    }
    const dislikeBtn = document.getElementById('outfitDislikeBtn');
    if (dislikeBtn) {
        dislikeBtn.title = t('btnDislikeOutfit');
        dislikeBtn.setAttribute('aria-label', t('btnDislikeOutfit'));
    }
    updateOutfitRatingButtonsState();
    const aboutTextEl = document.getElementById('aboutFullscreenText');
    if (aboutTextEl) {
        const paragraphs = (translations[lang] || translations.de).aboutText || [];
        const contactsHTML = `<div class="about-contacts">
            <a class="about-contact-link" href="mailto:benkuster@gmx.ch">
                <span class="about-contact-name">Ben Kuster</span>
                <span class="about-contact-mail">benkuster@gmx.ch</span>
            </a>
            <a class="about-contact-link" href="mailto:leandrolacognata@gmail.com">
                <span class="about-contact-name">Leandro La Cognata</span>
                <span class="about-contact-mail">leandrolacognata@gmail.com</span>
            </a>
        </div>`;
        aboutTextEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('') + contactsHTML;
    }
    const guideTextEl = document.getElementById('guideFullscreenText');
    if (guideTextEl) {
        const guideLines = (translations[lang] || translations.de).guideText || [];
        const [intro, ...steps] = guideLines;
        const introHtml = intro ? `<p>${intro}</p>` : '';
        const stepsHtml = steps.length
            ? `<ul class="guide-list">${steps.map((step) => `<li>${step}</li>`).join('')}</ul>`
            : '';
        guideTextEl.innerHTML = introHtml + stepsHtml;
    }
    const welcomeEl = document.getElementById('welcome');
    if (welcomeEl && welcomeEl.innerText.trim()) {
        const name = document.getElementById('username').value.trim();
        if (name) welcomeEl.innerText = t('welcomeText')(name);
    }
    renderGallery();
}

function setLanguage(lang) {
    applyLanguage(lang);
    const panel = document.getElementById('topMenuPanel');
    const menuButton = document.getElementById('topMenuBtn');
    if (panel) panel.classList.add('hidden');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
}
const maxUploadFileSizeBytes = 12 * 1024 * 1024;
const aiCategoryKeywords = {
    Oberteil: ['shirt', 't-shirt', 'tee shirt', 'jersey', 'sweater', 'sweatshirt', 'hoodie', 'jacket', 'coat', 'blouse', 'cardigan', 'poncho', 'kimono', 'vest', 'brassiere', 'top', 'gown', 'robe'],
    Hose: ['jean', 'jeans', 'trouser', 'trousers', 'pants', 'shorts', 'skirt', 'miniskirt', 'legging', 'leggings', 'sweatpants', 'sarong', 'kilt'],
    Schuhe: ['shoe', 'shoes', 'sandal', 'sneaker', 'loafer', 'slipper', 'slippers', 'boot', 'boots', 'moccasin', 'clog', 'running shoe', 'high heel', 'heel']
};
const defaultOutfitPositions = {
    shirt: { left: 100, top: 200 },
    pants: { left: 100, top: 200 },
    shoes: { left: 100, top: 200 }
};

let outfitPositions = cloneDefaultOutfitPositions();
let isUploadInProgress = false;
let pendingUploadFiles = [];
const externalScriptPromises = new Map();
let _categoryClassifierLoaderPromise = null;

function cloneDefaultOutfitPositions() {
    return {
        shirt: { ...defaultOutfitPositions.shirt },
        pants: { ...defaultOutfitPositions.pants },
        shoes: { ...defaultOutfitPositions.shoes }
    };
}

function parseStoredData(rawData) {
    if (!rawData) return null;
    try {
        return JSON.parse(rawData);
    } catch (error) {
        console.warn('Stored wardrobe data is invalid JSON.', error);
        return null;
    }
}

function extractWardrobeFromStoredData(parsedData) {
    if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
        return null;
    }

    if (parsedData.wardrobe && typeof parsedData.wardrobe === 'object' && !Array.isArray(parsedData.wardrobe)) {
        return parsedData.wardrobe;
    }

    const hasLegacyWardrobeShape = ['Oberteil', 'Hose', 'Schuhe'].some((category) => category in parsedData);
    return hasLegacyWardrobeShape ? parsedData : null;
}

function sanitizePositionValue(value, fallbackValue) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallbackValue;
}

function sanitizeStoredPositions(rawPositions) {
    const fallback = cloneDefaultOutfitPositions();
    if (!rawPositions || typeof rawPositions !== 'object') return fallback;

    for (const imageId of Object.keys(fallback)) {
        const candidate = rawPositions[imageId];
        if (!candidate || typeof candidate !== 'object') continue;
        fallback[imageId] = {
            left: sanitizePositionValue(candidate.left, fallback[imageId].left),
            top: sanitizePositionValue(candidate.top, fallback[imageId].top)
        };
    }

    return fallback;
}

function sanitizeStoredTrash(rawTrash) {
    const sanitized = createEmptyTrashBin();
    if (!rawTrash || typeof rawTrash !== 'object') return sanitized;

    for (const category of ['Oberteil', 'Hose', 'Schuhe']) {
        const storedItems = Array.isArray(rawTrash[category]) ? rawTrash[category] : [];
        sanitized[category] = storedItems
            .map((item) => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object' && typeof item.src === 'string') return item.src;
                return '';
            })
            .filter(Boolean);
    }

    return sanitized;
}

function ensureTrashStructure() {
    if (!trashBin || typeof trashBin !== 'object') {
        trashBin = createEmptyTrashBin();
        return;
    }

    for (const category of ['Oberteil', 'Hose', 'Schuhe']) {
        if (!Array.isArray(trashBin[category])) {
            trashBin[category] = [];
        }
    }
}

function getTrashItemCount() {
    return (trashBin.Oberteil || []).length + (trashBin.Hose || []).length + (trashBin.Schuhe || []).length;
}

function moveItemToTrash(category, imageSrc) {
    if (typeof imageSrc !== 'string' || !imageSrc) return;
    ensureTrashStructure();

    const items = trashBin[category] || [];
    items.unshift(imageSrc);

    const maxTrashItemsPerCategory = 120;
    if (items.length > maxTrashItemsPerCategory) {
        items.length = maxTrashItemsPerCategory;
    }

    trashBin[category] = items;
}

function loadPersistedState(storageKey) {
    const rawData = localStorage.getItem(storageKey);
    const parsedData = parseStoredData(rawData);
    if (!parsedData) {
        trashBin = createEmptyTrashBin();
        return false;
    }

    const persistedWardrobe = extractWardrobeFromStoredData(parsedData);
    if (!persistedWardrobe) {
        trashBin = createEmptyTrashBin();
        return false;
    }

    wardrobe = persistedWardrobe;
    outfitPositions = sanitizeStoredPositions(parsedData.positions);
    trashBin = sanitizeStoredTrash(parsedData.trashBin || parsedData.trash || null);
    return true;
}

function createEmptyOutfitFeedback() {
    return { likes: {}, dislikes: {} };
}

function getFeedbackStorageKey() {
    return `${currentUser || 'wardrobe_demo'}_outfit_feedback`;
}

function loadOutfitFeedback() {
    try {
        const raw = localStorage.getItem(getFeedbackStorageKey());
        if (!raw) {
            outfitFeedback = createEmptyOutfitFeedback();
            return;
        }

        const parsed = JSON.parse(raw);
        outfitFeedback = {
            likes: parsed && typeof parsed.likes === 'object' && parsed.likes ? parsed.likes : {},
            dislikes: parsed && typeof parsed.dislikes === 'object' && parsed.dislikes ? parsed.dislikes : {},
        };
    } catch (error) {
        console.warn('Outfit feedback could not be loaded.', error);
        outfitFeedback = createEmptyOutfitFeedback();
    }
}

function saveOutfitFeedback() {
    try {
        localStorage.setItem(getFeedbackStorageKey(), JSON.stringify(outfitFeedback));
    } catch (error) {
        console.warn('Outfit feedback could not be saved.', error);
    }
}

function normalizeSelection(selection) {
    if (!selection || typeof selection !== 'object') return null;
    const top = selection.Oberteil || '';
    const pants = selection.Hose || '';
    const shoes = selection.Schuhe || '';
    if (!top || !pants || !shoes) return null;
    return { Oberteil: top, Hose: pants, Schuhe: shoes };
}

function getCurrentDisplayedSelection() {
    const shirt = $('shirt');
    const pants = $('pants');
    const shoes = $('shoes');
    return normalizeSelection({
        Oberteil: shirt && shirt.getAttribute('src') ? shirt.getAttribute('src') : '',
        Hose: pants && pants.getAttribute('src') ? pants.getAttribute('src') : '',
        Schuhe: shoes && shoes.getAttribute('src') ? shoes.getAttribute('src') : '',
    });
}

function hasCompleteOutfitSelection(selection) {
    const normalized = normalizeSelection(selection);
    if (!normalized) return false;

    const values = [normalized.Oberteil, normalized.Hose, normalized.Schuhe];
    if (values.some((src) => !src || isStarterFieldDataUrl(src))) {
        return false;
    }

    return true;
}

function updateOutfitRatingButtonsState() {
    const likeBtn = document.getElementById('outfitLikeBtn');
    const dislikeBtn = document.getElementById('outfitDislikeBtn');
    const selection = normalizeSelection(lastGeneratedOutfitSelection) || getCurrentDisplayedSelection();
    const enabled = hasCompleteOutfitSelection(selection);

    if (likeBtn) likeBtn.disabled = !enabled;
    if (dislikeBtn) dislikeBtn.disabled = !enabled;
}

function selectionToKey(selection) {
    const normalized = normalizeSelection(selection);
    if (!normalized) return '';
    return `${normalized.Oberteil}||${normalized.Hose}||${normalized.Schuhe}`;
}

function getFeedbackScore(selection) {
    const key = selectionToKey(selection);
    if (!key) return 0;
    const likes = Number(outfitFeedback.likes[key] || 0);
    const dislikes = Number(outfitFeedback.dislikes[key] || 0);
    return likes * 180 - dislikes * 220;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function applyOutfitPositions() {
    for (const imageId of Object.keys(defaultOutfitPositions)) {
        const image = document.getElementById(imageId);
        if (!image) continue;

        const position = outfitPositions[imageId] || defaultOutfitPositions[imageId];
        image.style.left = `${Math.round(position.left)}px`;
        image.style.top = `${Math.round(position.top)}px`;
    }
}

function captureCurrentOutfitPositions() {
    for (const imageId of Object.keys(defaultOutfitPositions)) {
        const image = document.getElementById(imageId);
        if (!image) continue;

        const fallback = outfitPositions[imageId] || defaultOutfitPositions[imageId];
        const left = sanitizePositionValue(parseFloat(image.style.left), fallback.left);
        const top = sanitizePositionValue(parseFloat(image.style.top), fallback.top);
        outfitPositions[imageId] = { left, top };
    }
}

function setUploadUiState(isBusy) {
    const fileInput = document.getElementById('imageUpload');
    const categorySelect = document.getElementById('category');
    const addButton = document.querySelector('.menu-btn-primary');

    if (fileInput) fileInput.disabled = isBusy;
    if (categorySelect) categorySelect.disabled = isBusy;
    if (addButton) addButton.disabled = isBusy;
}

function getCategoryDisplayName(category) {
    return {
        Oberteil: t('catOberteil'),
        Hose: t('catHose'),
        Schuhe: t('catSchuhe'),
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
        alert(t('alertEnterName'));
        return;
    }

    currentUser = name;
    loadPersistedState(currentUser);
    loadOutfitFeedback();
    ensureWardrobeStructure();
    ensureTrashStructure();
    normalizeLegacyWardrobeLabels();
    const addedOnLogin = ensureMinimumStarterFieldsPerCategory(16);

    if (addedOnLogin > 0) {
        saveWardrobe({ skipRenderGallery: true });
    }

    document.getElementById("welcome").innerText = t('welcomeText')(name);
    document.getElementById("app").classList.remove("hidden");
    applyOutfitPositions();
    displayOutfit();
    renderGallery();
}

// called from the start screen
function startFromScreen(){
    const name = document.getElementById('startName').value.trim();
    if(!name){ alert(t('alertEnterName')); return; }
    document.getElementById('username').value = name;
    const s = document.getElementById('startScreen');
    if(s) s.classList.add('hidden');
    login();
}

function saveWardrobe(options = {}) {
    const key = currentUser || 'wardrobe_demo';
    captureCurrentOutfitPositions();
    ensureTrashStructure();

    try {
        localStorage.setItem(key, JSON.stringify({
            version: 2,
            wardrobe,
            positions: outfitPositions,
            trashBin
        }));
    } catch (error) {
        console.error('Could not save wardrobe.', error);
        alert('Speichern fehlgeschlagen (Speicher voll?). Bitte lösche alte Bilder aus der Galerie.');
        return false;
    }

    if (!options.skipRenderGallery) {
        renderGallery();
    }

    return true;
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function dataUrlToImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Bild konnte nicht fuer die KI geladen werden.'));
        img.src = dataUrl;
    });
}

async function dataUrlToCanvasContext(dataUrl) {
    const image = await dataUrlToImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        throw new Error('Canvas-Kontext fuer die Bildverarbeitung konnte nicht erstellt werden.');
    }

    ctx.drawImage(image, 0, 0);
    return { canvas, ctx, width: canvas.width, height: canvas.height };
}

async function trimTransparentImage(dataUrl, padding = 4) {
    const { canvas, ctx, width, height } = await dataUrlToCanvasContext(dataUrl);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = imageData[(y * width + x) * 4 + 3];
            if (alpha <= 8) continue;

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
    }

    if (maxX < 0 || maxY < 0) {
        throw new Error('Freigestelltes Bild ist leer.');
    }

    const sourceX = Math.max(0, minX - padding);
    const sourceY = Math.max(0, minY - padding);
    const sourceWidth = Math.min(width - sourceX, maxX - minX + 1 + padding * 2);
    const sourceHeight = Math.min(height - sourceY, maxY - minY + 1 + padding * 2);

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = Math.max(1, sourceWidth);
    trimmedCanvas.height = Math.max(1, sourceHeight);

    const trimmedCtx = trimmedCanvas.getContext('2d');
    if (!trimmedCtx) {
        throw new Error('Canvas-Kontext fuer das Zuschneiden konnte nicht erstellt werden.');
    }

    trimmedCtx.drawImage(
        canvas,
        sourceX,
        sourceY,
        trimmedCanvas.width,
        trimmedCanvas.height,
        0,
        0,
        trimmedCanvas.width,
        trimmedCanvas.height
    );

    return trimmedCanvas.toDataURL('image/png');
}

function colorDistanceRgb(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function removeSolidBackgroundFromEdges(dataUrl, tolerance = 30) {
    const { canvas, ctx, width, height } = await dataUrlToCanvasContext(dataUrl);
    if (width < 2 || height < 2) return dataUrl;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let sampleCount = 0;
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    const samplePixel = (x, y) => {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha < 16) return;
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
        sampleCount++;
    };

    for (let x = 0; x < width; x++) {
        samplePixel(x, 0);
        samplePixel(x, height - 1);
    }
    for (let y = 1; y < height - 1; y++) {
        samplePixel(0, y);
        samplePixel(width - 1, y);
    }

    if (!sampleCount) return dataUrl;

    const bgR = sumR / sampleCount;
    const bgG = sumG / sampleCount;
    const bgB = sumB / sampleCount;

    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let qHead = 0;
    let qTail = 0;

    const isBackgroundLike = (x, y) => {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha < 16) return false;
        return colorDistanceRgb(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB) <= tolerance;
    };

    const push = (x, y) => {
        const flat = y * width + x;
        if (visited[flat]) return;
        if (!isBackgroundLike(x, y)) return;
        visited[flat] = 1;
        queue[qTail++] = flat;
    };

    for (let x = 0; x < width; x++) {
        push(x, 0);
        push(x, height - 1);
    }
    for (let y = 1; y < height - 1; y++) {
        push(0, y);
        push(width - 1, y);
    }

    while (qHead < qTail) {
        const flat = queue[qHead++];
        const x = flat % width;
        const y = Math.floor(flat / width);

        if (x > 0) push(x - 1, y);
        if (x < width - 1) push(x + 1, y);
        if (y > 0) push(x, y - 1);
        if (y < height - 1) push(x, y + 1);
    }

    let removedCount = 0;
    for (let flat = 0; flat < visited.length; flat++) {
        if (!visited[flat]) continue;
        const idx = flat * 4;
        data[idx + 3] = 0;
        removedCount++;
    }

    if (!removedCount) return dataUrl;

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
}

function loadExternalScript(src) {
    if (externalScriptPromises.has(src)) {
        return externalScriptPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            externalScriptPromises.delete(src);
            reject(new Error(`Script konnte nicht geladen werden: ${src}`));
        };
        document.head.appendChild(script);
    });

    externalScriptPromises.set(src, promise);
    return promise;
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

let _removeBgLoaderPromise = null;

async function getRemoveBackgroundFn() {
    if (typeof window._removeBg === 'function') return window._removeBg;

    if (!_removeBgLoaderPromise) {
        _removeBgLoaderPromise = (async () => {
            const moduleUrl = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser/index.js';
            const modelPath  = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser/';
            const mod = await import(moduleUrl);
            const removeFn = mod.default || mod.removeBackground;
            if (typeof removeFn !== 'function') throw new Error('background-removal: kein Export gefunden.');
            return async (src) => {
                const result = await removeFn(src, { publicPath: modelPath });
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

async function removeBackground(dataUrl) {
    const fn = await getRemoveBackgroundFn();
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Hintergrundentfernung hat zu lange gedauert.')), 60000);
        fn(dataUrl)
            .then((result) => { clearTimeout(timer); resolve(result); })
            .catch((err)  => { clearTimeout(timer); reject(err);    });
    });
}

async function getCategoryClassifier() {
    if (typeof window.__wardrobeCategoryClassifier === 'function') {
        return window.__wardrobeCategoryClassifier;
    }

    if (!_categoryClassifierLoaderPromise) {
        _categoryClassifierLoaderPromise = (async () => {
            await loadExternalScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js');
            await loadExternalScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js');

            if (!window.tf || !window.mobilenet || typeof window.mobilenet.load !== 'function') {
                throw new Error('Kategorie-KI konnte nicht geladen werden.');
            }

            if (typeof window.tf.ready === 'function') {
                await window.tf.ready();
            }

            const model = await window.mobilenet.load({ version: 2, alpha: 1.0 });
            const classifier = async (dataUrl) => {
                const image = await dataUrlToImage(dataUrl);
                return model.classify(image, 5);
            };

            window.__wardrobeCategoryClassifier = classifier;
            return classifier;
        })();
    }

    try {
        return await _categoryClassifierLoaderPromise;
    } catch (err) {
        _categoryClassifierLoaderPromise = null;
        throw err;
    }
}

function inferCategoryFromPredictions(predictions) {
    const categoryScores = { Oberteil: 0, Hose: 0, Schuhe: 0 };

    for (const prediction of predictions || []) {
        const className = String(prediction.className || '').toLowerCase();
        const probability = Number(prediction.probability) || 0;

        for (const [category, keywords] of Object.entries(aiCategoryKeywords)) {
            if (keywords.some((keyword) => className.includes(keyword))) {
                categoryScores[category] += probability;
            }
        }
    }

    const sortedScores = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
    const [bestCategory, bestScore = 0] = sortedScores[0] || [];
    const [, nextScore = 0] = sortedScores[1] || [];

    if (!bestCategory) return null;
    if (bestScore < 0.2) return null;
    if (bestScore - nextScore < 0.05) return null;

    return { category: bestCategory, score: bestScore };
}

async function inferCategoryForUpload(originalSrc, processedSrc) {
    const classifier = await getCategoryClassifier();
    const sources = [processedSrc, originalSrc].filter(Boolean);
    let bestMatch = null;

    for (const source of sources) {
        const predictions = await classifier(source);
        const match = inferCategoryFromPredictions(predictions);
        if (!match) continue;

        if (!bestMatch || match.score > bestMatch.score) {
            bestMatch = match;
        }
    }

    return bestMatch ? bestMatch.category : null;
}

function isValidUploadFile(file) {
    if (!file) return false;
    if (typeof file.type !== 'string' || !file.type.startsWith('image/')) return false;
    if (typeof file.size === 'number' && file.size > maxUploadFileSizeBytes) return false;
    return true;
}

function buildUploadIssueMessage(duplicateCount, invalidCount) {
    const messageParts = [];

    if (duplicateCount > 0) {
        messageParts.push(`${duplicateCount} Stück wurde(n) nicht hinzugefügt, weil es bereits vorhanden ist.`);
    }
    if (invalidCount > 0) {
        messageParts.push(`${invalidCount} Datei(en) wurden übersprungen (nur Bilder bis 12 MB).`);
    }

    return messageParts.join('\n');
}

function isDuplicatePiece(category, imageSrc) {
    return (wardrobe[category] || []).includes(imageSrc);
}

function addPieceIfUnique(category, imageSrc) {
    if (isDuplicatePiece(category, imageSrc)) return false;
    wardrobe[category].push(imageSrc);
    return true;
}

function storePieceInExistingField(category, imageSrc) {
    if (!Array.isArray(wardrobe[category])) {
        wardrobe[category] = [];
    }

    if (isDuplicatePiece(category, imageSrc)) return false;

    const items = wardrobe[category] || [];
    const starterIndex = items.findIndex(isStarterFieldDataUrl);

    if (starterIndex >= 0) {
        items[starterIndex] = imageSrc;
        return true;
    }

    items.push(imageSrc);
    return true;
}

function updateGalleryAddButtonColor() {
    const select = document.getElementById('galleryCategory');
    const btn = document.getElementById('galleryAddBtn');
    if (!select || !btn) return;
    const buttonColor = categoryFieldColor[select.value] || categoryFieldColor.Hose;
    btn.style.background = buttonColor;
    btn.style.borderColor = buttonColor;
    btn.style.color = '#fff';
}

function updateMainCategoryFieldColor() {
    const select = document.getElementById('category');
    if (!select) return;
    const fieldColor = categoryFieldColor[select.value] || categoryFieldColor.Hose;
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
    const color = categoryFieldColor[category] || categoryFieldColor.Hose;
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

function ensureMinimumStarterFieldsPerCategory(minPerCategory = 16) {
    let changedTotal = 0;

    for (const category of ['Oberteil', 'Hose', 'Schuhe']) {
        const previousItems = Array.isArray(wardrobe[category]) ? wardrobe[category] : [];
        const normalizedItems = previousItems
            .map(removeLegacyLabelFromSvgDataUrl)
            .map((src) => normalizeStarterFieldToCategoryColor(category, src));

        while (normalizedItems.length < minPerCategory) {
            normalizedItems.push(createColorFieldDataUrl(categoryFieldColor[category] || categoryFieldColor.Hose));
        }

        const unchanged =
            previousItems.length === normalizedItems.length &&
            previousItems.every((item, index) => item === normalizedItems[index]);

        if (!unchanged) {
            changedTotal++;
        }

        wardrobe[category] = normalizedItems;
        wardrobeSelected[category] = Math.min(
            wardrobeSelected[category] || 0,
            Math.max(0, normalizedItems.length - 1)
        );
    }

    return changedTotal;
}

function addGalleryField() {
    const categorySelect = document.getElementById('galleryCategory');
    const mainCategory = document.getElementById('category');
    const category = categorySelect ? categorySelect.value : (mainCategory ? mainCategory.value : 'Oberteil');
    const color = categoryFieldColor[category] || categoryFieldColor.Hose;
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
    let invalidCount = 0;
    const recategorizedCounts = {};

    for (const file of files) {
        if (!isValidUploadFile(file)) {
            invalidCount++;
            continue;
        }

        const dataUrl = await fileToDataUrl(file);
        let finalSrc = dataUrl;
        try {
            const removedBackgroundSrc = await removeBackground(dataUrl);
            try {
                finalSrc = await trimTransparentImage(removedBackgroundSrc);
            } catch (trimErr) {
                console.warn('Zuschneiden der Freistellung fehlgeschlagen. Freigestelltes Bild wird ohne Zuschneiden verwendet.', trimErr);
                finalSrc = removedBackgroundSrc;
            }
        } catch (err) {
            console.warn('KI-Freistellung fehlgeschlagen. Lokaler Fallback wird versucht.', err);
            try {
                const fallbackSrc = await removeSolidBackgroundFromEdges(dataUrl);
                try {
                    finalSrc = await trimTransparentImage(fallbackSrc);
                } catch (trimErr) {
                    console.warn('Zuschneiden nach Fallback-Freistellung fehlgeschlagen. Fallback-Bild wird verwendet.', trimErr);
                    finalSrc = fallbackSrc;
                }
            } catch (fallbackErr) {
                console.warn('Fallback-Freistellung fehlgeschlagen. Originalbild wird verwendet.', fallbackErr);
                finalSrc = dataUrl;
            }
        }

        let targetCategory = category;
        try {
            const inferredCategory = await inferCategoryForUpload(dataUrl, finalSrc);
            if (inferredCategory) {
                targetCategory = inferredCategory;
            }
        } catch (err) {
            console.warn('KI-Kategorisierung fehlgeschlagen. Gewaehlte Kategorie wird verwendet.', err);
        }

        if (targetCategory !== category) {
            const transitionKey = `${category}->${targetCategory}`;
            recategorizedCounts[transitionKey] = (recategorizedCounts[transitionKey] || 0) + 1;
        }

        if (storePieceInExistingField(targetCategory, finalSrc)) {
            addedCount++;
        } else {
            duplicateCount++;
        }
    }

    return { addedCount, duplicateCount, invalidCount, recategorizedCounts };
}

async function addMultipleItems() {
    return addItem();
}

async function addItem() {
    if (isUploadInProgress) {
        alert('Upload läuft bereits. Bitte kurz warten.');
        return;
    }

    const categorySelect = document.getElementById("category");
    const fileInput = document.getElementById("imageUpload");
    if (!categorySelect || !fileInput) {
        alert('Upload-Elemente konnten nicht gefunden werden. Bitte Seite neu laden.');
        return;
    }

    const filesFromInput = Array.from(fileInput.files || []);
    const files = filesFromInput.length ? filesFromInput : [...pendingUploadFiles];
    if (!files.length) {
        alert(t('alertChooseFilesFirst'));
        return;
    }

    isUploadInProgress = true;
    setUploadUiState(true);

    try {
        let addedCount = 0;
        let duplicateCount = 0;
        let invalidCount = 0;

        try {
            const result = await processFilesForCategory(categorySelect.value, files);
            addedCount = result.addedCount;
            duplicateCount = result.duplicateCount;
            invalidCount = result.invalidCount;
        } catch (processingError) {
            console.warn('Upload-Verarbeitung fehlgeschlagen. Direkter Fallback wird verwendet.', processingError);

            for (const file of files) {
                if (!isValidUploadFile(file)) {
                    invalidCount++;
                    continue;
                }

                try {
                    const dataUrl = await fileToDataUrl(file);
                    if (storePieceInExistingField(categorySelect.value, dataUrl)) {
                        addedCount++;
                    } else {
                        duplicateCount++;
                    }
                } catch (fileError) {
                    console.warn('Datei konnte im Fallback nicht gelesen werden.', fileError);
                    invalidCount++;
                }
            }
        }

        if (addedCount > 0) {
            saveWardrobe();
            displayOutfit();
        }

        const issueMessage = buildUploadIssueMessage(duplicateCount, invalidCount);
        if (issueMessage) {
            alert(issueMessage);
        }

        if (addedCount === 0 && duplicateCount === 0 && invalidCount === 0) {
            alert('Es konnten keine Kleidungsstücke hinzugefügt werden. Bitte versuche es mit einem anderen Bild.');
        }
    } finally {
        pendingUploadFiles = [];
        fileInput.value = "";
        isUploadInProgress = false;
        setUploadUiState(false);
    }
}

const colorAnalysisCache = new Map();

function getCategoryCandidates(category) {
    const allItems = wardrobe[category] || [];
    const preferredItems = allItems.filter((src) => !isStarterFieldDataUrl(src));
    return preferredItems.length ? preferredItems : allItems;
}

function colorDistance(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

function extractAverageColorFromImage(img) {
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 20) continue;
        red += data[i];
        green += data[i + 1];
        blue += data[i + 2];
        count += 1;
    }

    if (!count) return null;

    return {
        r: red / count,
        g: green / count,
        b: blue / count,
    };
}

function getImageAverageColor(src) {
    if (!src) return Promise.resolve(null);
    if (colorAnalysisCache.has(src)) return Promise.resolve(colorAnalysisCache.get(src));

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const color = extractAverageColorFromImage(img);
            colorAnalysisCache.set(src, color);
            resolve(color);
        };
        img.onerror = () => {
            colorAnalysisCache.set(src, null);
            resolve(null);
        };
        img.src = src;
    });
}

async function findBestMatchingOutfit() {
    const categories = ['Oberteil', 'Hose', 'Schuhe'];
    const candidateLimit = 12;

    const candidateMap = {};
    for (const category of categories) {
        const candidates = getCategoryCandidates(category).slice(0, candidateLimit);
        if (!candidates.length) return null;
        candidateMap[category] = candidates;
    }

    if (
        candidateMap.Oberteil.length === 1 &&
        candidateMap.Hose.length === 1 &&
        candidateMap.Schuhe.length === 1
    ) {
        return {
            Oberteil: candidateMap.Oberteil[0],
            Hose: candidateMap.Hose[0],
            Schuhe: candidateMap.Schuhe[0],
        };
    }

    const analyzedMap = {};
    for (const category of categories) {
        const analyzed = await Promise.all(
            candidateMap[category].map(async (src) => ({
                src,
                color: await getImageAverageColor(src),
            }))
        );
        analyzedMap[category] = analyzed;
    }

    let best = null;
    let bestScore = Infinity;

    for (const top of analyzedMap.Oberteil) {
        for (const pants of analyzedMap.Hose) {
            for (const shoes of analyzedMap.Schuhe) {
                const missingPenalty =
                    (top.color ? 0 : 220) +
                    (pants.color ? 0 : 220) +
                    (shoes.color ? 0 : 220);

                const topPants = top.color && pants.color ? colorDistance(top.color, pants.color) : 140;
                const topShoes = top.color && shoes.color ? colorDistance(top.color, shoes.color) : 140;
                const pantsShoes = pants.color && shoes.color ? colorDistance(pants.color, shoes.color) : 140;

                const score =
                    topPants * 1.0 +
                    topShoes * 0.95 +
                    pantsShoes * 0.85 +
                    missingPenalty -
                    getFeedbackScore({
                        Oberteil: top.src,
                        Hose: pants.src,
                        Schuhe: shoes.src,
                    });

                if (score < bestScore) {
                    bestScore = score;
                    best = {
                        Oberteil: top.src,
                        Hose: pants.src,
                        Schuhe: shoes.src,
                    };
                }
            }
        }
    }

    return best;
}

function applyOutfitSelection(selection) {
    const normalizedSelection = normalizeSelection(selection);
    if (!normalizedSelection) return;

    for (const category of ['Oberteil', 'Hose', 'Schuhe']) {
        const img = $(categoryToImgId[category]);
        if (!img) continue;
        img.src = normalizedSelection[category] || '';
    }
    lastGeneratedOutfitSelection = { ...normalizedSelection };
    applyOutfitPositions();
    attachDragHandlers();
    updateOutfitRatingButtonsState();
}

async function generateOutfit() {
    if (
        wardrobe.Oberteil.length === 0 ||
        wardrobe.Hose.length === 0 ||
        wardrobe.Schuhe.length === 0
    ) {
        alert("Bitte füge Kleidung zu allen Kategorien hinzu!");
        return;
    }

    const bestOutfit = await findBestMatchingOutfit();
    if (bestOutfit) {
        applyOutfitSelection(bestOutfit);
        return;
    }

    displayOutfit();
}

function displayOutfit() {
    // pick a random item per category (if available) and set the corresponding image
    const selection = { Oberteil: '', Hose: '', Schuhe: '' };
    for (const cat of ['Oberteil', 'Hose', 'Schuhe']) {
        const allItems = wardrobe[cat] || [];
        const preferredItems = allItems.filter((src) => !isStarterFieldDataUrl(src));
        const arr = preferredItems.length ? preferredItems : allItems;
        const img = $(categoryToImgId[cat]);
        if (!img) continue;
        const src = arr.length ? randomItem(arr) : '';
        img.src = src;
        selection[cat] = src;
    }

    lastGeneratedOutfitSelection = normalizeSelection(selection);

    applyOutfitPositions();
    // ensure drag handlers attached in case elements exist
    attachDragHandlers();
    updateOutfitRatingButtonsState();
}

function rateCurrentOutfit(liked) {
    const selection = normalizeSelection(lastGeneratedOutfitSelection) || getCurrentDisplayedSelection();
    if (!hasCompleteOutfitSelection(selection)) {
        return;
    }
    const key = selectionToKey(selection);

    if (liked) {
        outfitFeedback.likes[key] = Number(outfitFeedback.likes[key] || 0) + 1;
        outfitFeedback.dislikes[key] = Math.max(0, Number(outfitFeedback.dislikes[key] || 0) - 1);
        alert(t('alertRatedLike'));
    } else {
        outfitFeedback.dislikes[key] = Number(outfitFeedback.dislikes[key] || 0) + 1;
        outfitFeedback.likes[key] = Math.max(0, Number(outfitFeedback.likes[key] || 0) - 1);
        alert(t('alertRatedDislike'));
    }

    saveOutfitFeedback();
    lastGeneratedOutfitSelection = { ...selection };
    updateOutfitRatingButtonsState();
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function startGenerator() {
    generateOutfit();
}

function toggleEdit() {
    const panel = document.getElementById("editPanel");
    if (!panel) return;

    if (panel.classList.contains("hidden")) {
        showEdit();
        panel.classList.remove("hidden");
    } else {
        panel.classList.add("hidden");
    }
}

function showEdit() {
    const editContent = document.getElementById("editContent");
    if (!editContent) return;

    editContent.innerHTML = "";
    for (const category in wardrobe) {
        (wardrobe[category] || []).forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "edit-item";
            itemDiv.innerHTML = `<div><img src="${item}"></div><button onclick="deleteItem('${category}', ${index})">Löschen</button>`;
            editContent.appendChild(itemDiv);
        });
    }
}

function toggleTrashPanel() {
    const panel = document.getElementById('trashPanel');
    if (!panel) return;

    const opening = panel.classList.contains('hidden');
    if (opening) {
        panel.classList.remove('hidden');
    } else {
        panel.classList.add('hidden');
    }

    renderTrashPanel();
}

function restoreTrashItem(category, index) {
    ensureTrashStructure();
    const categoryItems = trashBin[category] || [];
    if (index < 0 || index >= categoryItems.length) return;

    const [src] = categoryItems.splice(index, 1);
    if (!src) {
        renderTrashPanel();
        return;
    }

    if (!storePieceInExistingField(category, src)) {
        categoryItems.splice(index, 0, src);
        alert('Dieses Kleidungsstück ist bereits vorhanden.');
        renderTrashPanel();
        return;
    }

    saveWardrobe();
    displayOutfit();

    const editPanel = document.getElementById('editPanel');
    if (editPanel && !editPanel.classList.contains('hidden')) {
        showEdit();
    }
}

function emptyTrashPermanently() {
    ensureTrashStructure();
    const total = getTrashItemCount();
    if (!total) return;

    const confirmed = confirm(`Wirklich alle ${total} Einträge im Papierkorb dauerhaft löschen?`);
    if (!confirmed) return;

    trashBin = createEmptyTrashBin();
    saveWardrobe();
}

function renderTrashPanel() {
    const panel = document.getElementById('trashPanel');
    const title = document.getElementById('trashTitle');
    const content = document.getElementById('trashContent');
    const clearBtn = document.getElementById('trashClearBtn');
    const toggleBtn = document.getElementById('trashToggleBtn');

    if (!content) return;

    ensureTrashStructure();
    const total = getTrashItemCount();

    if (title) title.innerText = t('trashTitle')(total);
    if (clearBtn) clearBtn.disabled = total === 0;
    if (toggleBtn) {
        const isOpen = panel && !panel.classList.contains('hidden');
        const label = isOpen ? `Papierkorb schließen (${total})` : `Papierkorb öffnen (${total})`;
        toggleBtn.innerText = '🗑️';
        toggleBtn.title = label;
        toggleBtn.setAttribute('aria-label', label);
        toggleBtn.dataset.count = String(total);
    }

    content.innerHTML = '';

    if (total === 0) {
        const empty = document.createElement('div');
        empty.className = 'trash-empty';
        empty.innerText = 'Papierkorb ist leer.';
        content.appendChild(empty);
        return;
    }

    for (const category of ['Oberteil', 'Hose', 'Schuhe']) {
        const items = trashBin[category] || [];
        if (!items.length) continue;

        const categoryBlock = document.createElement('div');
        categoryBlock.className = 'trash-category';

        const categoryLabel = document.createElement('div');
        categoryLabel.className = 'trash-category-label';
        categoryLabel.innerText = getCategoryDisplayName(category);
        categoryBlock.appendChild(categoryLabel);

        const list = document.createElement('div');
        list.className = 'trash-items';

        items.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'trash-item';

            const img = document.createElement('img');
            img.src = src;
            img.alt = `${getCategoryDisplayName(category)} im Papierkorb`;

            const restoreBtn = document.createElement('button');
            restoreBtn.type = 'button';
            restoreBtn.innerText = 'Zurückholen';
            restoreBtn.onclick = () => restoreTrashItem(category, index);

            item.appendChild(img);
            item.appendChild(restoreBtn);
            list.appendChild(item);
        });

        categoryBlock.appendChild(list);
        content.appendChild(categoryBlock);
    }
}

function deleteItem(category, index) {
    if (!Array.isArray(wardrobe[category])) return;
    if (index < 0 || index >= wardrobe[category].length) return;

    const removedItem = wardrobe[category][index];
    wardrobe[category].splice(index, 1);
    moveItemToTrash(category, removedItem);
    wardrobeSelected[category] = Math.min(
        wardrobeSelected[category] || 0,
        Math.max(0, wardrobe[category].length - 1)
    );
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
        loadPersistedState('wardrobe_demo');
        ensureWardrobeStructure();
        ensureTrashStructure();
        normalizeLegacyWardrobeLabels();
        const addedOnStartup = ensureMinimumStarterFieldsPerCategory(16);
        if (addedOnStartup > 0) {
            saveWardrobe({ skipRenderGallery: true });
        }
        // keep at least 16 fields available
    } catch (e) {
        console.warn('Could not load saved wardrobe demo', e);
    }
})();

// Add simple SVG sample items so the generator can be tried without uploads
function addSampleWardrobe() {
    ensureMinimumStarterFieldsPerCategory(16);

    saveWardrobe();
    displayOutfit();
}

function removeGalleryItem(category, index) {
    const items = wardrobe[category] || [];
    if (index < 0 || index >= items.length) return;
    const isStarterField = isStarterFieldDataUrl(items[index]);
    const confirmed = confirm(
        isStarterField
            ? `${getCategoryDisplayName(category)}-Feld #${index + 1} löschen?`
            : `${getCategoryDisplayName(category)} #${index + 1} aus dem Feld entfernen?`
    );
    if (!confirmed) return;

    const removedItem = items[index];
    if (isStarterField) {
        items.splice(index, 1);
        const maxIndex = Math.max(0, items.length - 1);
        if (wardrobeSelected[category] > maxIndex) {
            wardrobeSelected[category] = maxIndex;
        }
    } else {
        items[index] = createColorFieldDataUrl(categoryFieldColor[category] || categoryFieldColor.Hose);
        moveItemToTrash(category, removedItem);
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
    if (title) title.innerText = t('galleryTitle')(totalCount);
    for(const category of ['Oberteil','Hose','Schuhe']){
        const catDiv = document.createElement('div');
        catDiv.className = 'cat';
        const label = document.createElement('div');
        label.className = 'cat-label';
        label.innerText = getCategoryDisplayName(category);
        const thumbs = document.createElement('div');
        thumbs.className = 'thumbs';
        const categoryItems = wardrobe[category] || [];
        categoryItems.forEach((src, idx)=>{
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

    renderTrashPanel();
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
    const area = document.getElementById('outfitArea');
    const items = document.querySelectorAll('#outfitArea .clothing');

    items.forEach(el => {
        if (el._dragAttached) return;
        el._dragAttached = true;
        el.draggable = false;
        el.style.position = 'absolute';
        el.style.touchAction = 'none';

        let dragging = false;
        let startX = 0;
        let startY = 0;
        let origLeft = 0;
        let origTop = 0;

        const finishDrag = (pointerId) => {
            if (!dragging) return;
            dragging = false;
            try { el.releasePointerCapture(pointerId); } catch (e) {}
            el.classList.remove('dragging');
            captureCurrentOutfitPositions();
            saveWardrobe({ skipRenderGallery: true });
        };

        el.addEventListener('pointerdown', (ev) => {
            ev.preventDefault();
            el.setPointerCapture(ev.pointerId);
            dragging = true;
            startX = ev.clientX;
            startY = ev.clientY;
            origLeft = parseFloat(el.style.left) || el.offsetLeft || 0;
            origTop = parseFloat(el.style.top) || el.offsetTop || 0;
            el.classList.add('dragging');
        });

        el.addEventListener('pointermove', (ev) => {
            if (!dragging) return;

            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            const nextLeft = origLeft + dx;
            const nextTop = origTop + dy;

            el.style.left = `${nextLeft}px`;
            el.style.top = `${nextTop}px`;
        });

        el.addEventListener('pointerup', (ev) => finishDrag(ev.pointerId));
        el.addEventListener('pointercancel', (ev) => finishDrag(ev.pointerId));
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

    const images = ['shirt', 'pants', 'shoes']
        .map((id) => document.getElementById(id))
        .filter((imgEl) => imgEl && (imgEl.getAttribute('src') || '').trim() !== '');

    if (!images.length) {
        alert('Es ist kein Outfit zum Herunterladen vorhanden.');
        return;
    }

    const w = area.clientWidth;
    const h = area.clientHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.fillStyle = window.getComputedStyle(area).backgroundColor || '#070707';
    ctx.fillRect(0, 0, w, h);

    let toLoad = images.length;

    images.forEach((imgEl) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const left = parseFloat(imgEl.style.left) || imgEl.offsetLeft || 0;
            const top = parseFloat(imgEl.style.top) || imgEl.offsetTop || 0;
            const dw = imgEl.clientWidth || img.width;
            const dh = imgEl.clientHeight || img.height;
            ctx.drawImage(img, left, top, dw, dh);
            toLoad--;
            if (toLoad === 0) finish();
        };
        img.onerror = () => {
            toLoad--;
            if (toLoad === 0) finish();
        };
        img.src = imgEl.src;
    });

    function finish(){
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'outfit.png';
        a.click();
    }
}

// Toggle gallery visibility with a single click
function toggleGallery(){
    const gallery = document.getElementById('gallery');
    const btn = document.getElementById('toggleGalleryBtn');
    const app = document.getElementById('app');
    const topMenuBtn = document.getElementById('topMenuBtn');
    if(!gallery || !app) return;
    const opening = !app.classList.contains('gallery-open');
    if(opening){
        const addedOnOpen = ensureMinimumStarterFieldsPerCategory(16);
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
        document.body.style.overflow = 'hidden';
        if(btn) btn.innerText = t('btnGalleryClose');
        if(topMenuBtn) topMenuBtn.classList.add('hidden');
    } else {
        app.classList.remove('gallery-open');
        gallery.classList.add('hidden');
        document.body.style.overflow = '';
        if(btn) btn.innerText = t('btnGalleryOpen');
        if(topMenuBtn) topMenuBtn.classList.remove('hidden');
    }
}

function toggleAboutSection() {
    const section = document.getElementById('aboutSection');
    const button = document.getElementById('toggleAboutBtn');
    if (!section || !button) return;

    const opening = section.classList.contains('hidden');
    section.classList.toggle('hidden');
    button.setAttribute('aria-expanded', String(opening));
    button.innerText = opening ? 'Über uns schließen' : 'Über uns';
}

// attach handlers on initial load
document.addEventListener('DOMContentLoaded', () => attachDragHandlers());

// Ensure start screen input and interactions are initialized
window.addEventListener('DOMContentLoaded', () => {
    const startInput = document.getElementById('startName');
    const mainCategory = document.getElementById('category');
    const imageUpload = document.getElementById('imageUpload');

    if (startInput) startInput.focus();
    if (startInput) {
        startInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') startFromScreen();
        });
    }

    if (mainCategory) {
        mainCategory.addEventListener('change', updateMainCategoryFieldColor);
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', () => {
            pendingUploadFiles = Array.from(imageUpload.files || []);
            if (pendingUploadFiles.length && !isUploadInProgress) {
                addItem();
            }
        });
    }

    applyLanguage(currentLang);
    applyOutfitPositions();
    setUploadUiState(false);
    updateMainCategoryFieldColor();
    updateGalleryAddButtonColor();
    updateOutfitRatingButtonsState();

    document.addEventListener('click', (event) => {
        const panel = document.getElementById('topMenuPanel');
        const button = document.getElementById('topMenuBtn');
        const wrap = document.querySelector('.top-menu-wrap');
        if (!panel || !button || !wrap) return;
        if (panel.classList.contains('hidden')) return;
        if (wrap.contains(event.target)) return;
        panel.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
    });

    const fullscreen = document.getElementById('aboutFullscreen');
    if (fullscreen) {
        fullscreen.addEventListener('click', (event) => {
            if (event.target === fullscreen) closeAboutFullscreen();
        });
    }

    const guideFullscreen = document.getElementById('guideFullscreen');
    if (guideFullscreen) {
        guideFullscreen.addEventListener('click', (event) => {
            if (event.target === guideFullscreen) closeGuideFullscreen();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAboutFullscreen();
            closeGuideFullscreen();
            const panel = document.getElementById('topMenuPanel');
            const button = document.getElementById('topMenuBtn');
            if (panel && !panel.classList.contains('hidden')) {
                panel.classList.add('hidden');
                if (button) button.setAttribute('aria-expanded', 'false');
            }
        }
    });

    document.addEventListener('click', (event) => {
        const panel = document.getElementById('topMenuPanel');
        const button = document.getElementById('topMenuBtn');
        if (!panel || panel.classList.contains('hidden')) return;
        if (!panel.contains(event.target) && event.target !== button) {
            panel.classList.add('hidden');
            if (button) button.setAttribute('aria-expanded', 'false');
        }
    });
});

function toggleTopMenu() {
    const panel = document.getElementById('topMenuPanel');
    const button = document.getElementById('topMenuBtn');
    if (!panel || !button) return;
    const opening = panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    button.setAttribute('aria-expanded', String(opening));
}

function openAboutFullscreen() {
    const fullscreen = document.getElementById('aboutFullscreen');
    if (!fullscreen) return;
    const guideFullscreen = document.getElementById('guideFullscreen');
    if (guideFullscreen) guideFullscreen.classList.add('hidden');
    fullscreen.classList.remove('hidden');
    updateOverlayScrollLock();
    const panel = document.getElementById('topMenuPanel');
    const menuButton = document.getElementById('topMenuBtn');
    if (panel) panel.classList.add('hidden');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
}

function closeAboutFullscreen() {
    const fullscreen = document.getElementById('aboutFullscreen');
    if (!fullscreen) return;
    fullscreen.classList.add('hidden');
    updateOverlayScrollLock();
}

function openGuideFullscreen() {
    const fullscreen = document.getElementById('guideFullscreen');
    if (!fullscreen) return;
    const aboutFullscreen = document.getElementById('aboutFullscreen');
    if (aboutFullscreen) aboutFullscreen.classList.add('hidden');
    fullscreen.classList.remove('hidden');
    updateOverlayScrollLock();
    const panel = document.getElementById('topMenuPanel');
    const menuButton = document.getElementById('topMenuBtn');
    if (panel) panel.classList.add('hidden');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
}

function closeGuideFullscreen() {
    const fullscreen = document.getElementById('guideFullscreen');
    if (!fullscreen) return;
    fullscreen.classList.add('hidden');
    updateOverlayScrollLock();
}

function updateOverlayScrollLock() {
    const aboutFullscreen = document.getElementById('aboutFullscreen');
    const guideFullscreen = document.getElementById('guideFullscreen');
    const isAnyOverlayOpen =
        (aboutFullscreen && !aboutFullscreen.classList.contains('hidden')) ||
        (guideFullscreen && !guideFullscreen.classList.contains('hidden'));

    document.body.style.overflow = isAnyOverlayOpen ? 'hidden' : '';
}
