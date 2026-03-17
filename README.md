# Date Counter Card

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
[![translations][translations-badge]][translations-url]

Eine einfache Home Assistant Custom Card, die live anzeigt, wie viel Zeit seit einem festgelegten Datum und Uhrzeit vergangen ist.

## Funktionen

- Zeigt vergangene Zeit in Tagen, Stunden, Minuten und Sekunden
- Live-Update jede Sekunde
- Konfigurierbarer Titel
- Datum und Uhrzeit direkt im visuellen Editor auswählbar
- HACS-kompatibel

## Voraussetzungen

- Home Assistant mit Lovelace Dashboard
- Zugriff auf `www` (lokale Ressourcen)
- Optional: HACS für einfache Installation/Updates

## Installation

### Option 1: Über HACS (empfohlen)

Date Counter Card ist in HACS (Home Assistant Community Store) verfügbar.

Nutze diesen Link, um das Repository direkt in HACS zu öffnen:

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=PaulTubeTV&repository=date-counter)

oder

1. Öffne HACS in Home Assistant.
2. Gehe zu **Frontend**.
3. Füge dieses Repository als **Custom Repository** hinzu.
4. Wähle Kategorie **Dashboard** (oder **Lovelace**, je nach HACS-Version).
5. Installiere **Date Counter Card**.
6. Starte Home Assistant neu.

### Option 2: Manuell

1. Kopiere die Datei `dist/date-counter.js` nach:
   - `<config>/www/date-counter.js`
2. Füge die Ressource in Home Assistant hinzu:

```yaml
url: /local/date-counter.js
type: module
```

3. Home Assistant neu starten (oder Frontend hart neu laden).

## Verwendung

Füge eine Karte in Lovelace hinzu:

```yaml
type: custom:date-counter-card
title: Seit Projektstart
date: "2025-01-01T08:00"
```

## Konfigurationsoptionen

- `type` (Pflicht): Muss `custom:date-counter-card` sein
- `title` (optional): Überschrift der Karte
  - Standard: `Zeit seit Datum`
- `date` (Pflicht für Anzeige): Startdatum mit Uhrzeit im Format `YYYY-MM-DDTHH:mm`
  - Beispiel: `2026-03-17T14:30`

## Hinweise

- Die Karte verwendet die lokale Zeit des Browsers/Home Assistant-Frontends.
- Wenn kein gültiges Datum gesetzt ist, wird ein Hinweistext angezeigt.
- Änderungen in der Konfiguration werden sofort übernommen.

## Fehlerbehebung

- Karte wird nicht angezeigt:
  - Prüfe, ob die Ressource korrekt eingebunden ist (`/local/date-counter.js`).
  - Prüfe Browser-Konsole auf JavaScript-Fehler.
- Datum wird nicht gezählt:
  - Stelle sicher, dass das Format `YYYY-MM-DDTHH:mm` verwendet wird.
- Nach Installation keine Änderung sichtbar:
  - Browser-Cache leeren und Seite hart neu laden.


[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/HACS-Default-41BDF5?style=flat-square

[release-url]: https://github.com/PaulTubeTV/date-counter/releases
[release-badge]: https://img.shields.io/github/v/release/PaulTubeTV/date-counter?style=flat-square

[downloads-badge]: https://img.shields.io/github/downloads/PaulTubeTV/date-counter/total?style=flat-square

[translations-url]: https://github.com/PaulTubeTV/date-counter/issues
[translations-badge]: https://img.shields.io/badge/i18n-planned-2ea44f?style=flat-square