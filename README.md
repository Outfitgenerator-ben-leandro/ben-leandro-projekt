# Outfit-Generator

Ein einfacher Outfit-Generator mit Startseite, Galerie, Upload und Download-Funktion.

## Stand heute (17.03.2026)

- Startseite nutzt ein eigenes Fullscreen-Hintergrundbild: `Ben-equal-stripes-hd.png`.
- Galerie ist wieder im Fullscreen-Overlay wie zuvor.
- Kategorienamen in der UI sind auf Deutsch pluralisiert: **Oberteile** und **Hosen**.
- Pro Kategorie werden wieder die Standard-Felder 1 bis 15 hergestellt.
- Aktuelle Sicherung wurde erstellt: `backup-20260317-131430/`.

## Welche Datei ist wofür?

- `index.html`  
	Enthält die Seitenstruktur: Startscreen, Hauptbereich, Buttons, Galerie-Container.

- `style.css`  
	Enthält das komplette Design: Farben, Layout, Fullscreen-Galerie und Startseiten-Hintergrund.

- `script.js`  
	Enthält die gesamte Logik: Login/Start, LocalStorage, Uploads, Galerie, Outfit-Erstellung, Drag & Drop, Download.

- `Ben-equal-stripes-hd.png`  
	Aktuelles Hintergrundbild der Startseite (wird in `style.css` verwendet).

- Weitere Bilddateien (`Ben.jpg`, `lol.png`, `start-bg-clean.png`, `nothing.jpeg`, WhatsApp-Bilder)  
	Zusätzliche/ältere Bilder aus der Bearbeitung. Nur nötig, wenn du sie aktiv verwenden willst.

- `backup-.../`  
	Sicherheitskopien des Projekts (Zeitstempel im Ordnernamen).

## Für GitHub hochladen (Minimum)

Diese Dateien reichen für die Online-Version:

- `index.html`
- `style.css`
- `script.js`
- `Ben-equal-stripes-hd.png`

Optional:

- `README.md`
- andere Bilder, falls du sie im Code verwendest

## Nicht nötig für GitHub

- `backup-.../`
- `Git-2.53.0.2-64-bit.exe`

## GitHub Pages online stellen

1. Neues Repository auf GitHub erstellen.
2. Dieses Projekt in das Repo pushen.
3. Auf GitHub: **Settings > Pages** öffnen.
4. Bei **Build and deployment** auswählen: **Deploy from a branch**.
5. Branch **main** und Ordner **/(root)** wählen.
6. Speichern und 1–3 Minuten warten.

Danach ist die Seite unter deiner GitHub-Pages-URL online.

## Hintergrundbild ändern

Wenn du ein anderes Startbild willst, ändere in `style.css` im Block `.start-screen` die Zeile:

`background-image: url('Ben-equal-stripes-hd.png');`

