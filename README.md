# Date Counter Card

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
[![translations][translations-badge]][translations-url]

An easy Home Assistant custom card that shows live elapsed time since a configured date and time.

## Features

- Shows elapsed time in days, hours, minutes, and seconds
- Live update every second
- Configurable title
- Date and time can be selected directly in the visual editor
- HACS compatible
- Built-in translations: DE, EN, FR, ES, IT, NL

## Requirements

- Home Assistant with Lovelace dashboard
- Access to `www` (local resources)
- Optional: HACS for easier installation and updates

## Installation

### Option 1: Via HACS (recommended)

Date Counter Card is available in HACS (Home Assistant Community Store).

Use this link to open the repository directly in HACS:

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=PaulTubeTV&repository=date-counter)

or

1. Open HACS in Home Assistant.
2. Go to **Frontend**.
3. Add this repository as a **Custom Repository**.
4. Select category **Dashboard** (or **Lovelace**, depending on HACS version).
5. Install **Date Counter Card**.
6. Restart Home Assistant.

### Option 2: Manual

1. Copy `dist/date-counter.js` to:
   - `<config>/www/date-counter.js`
2. Add the resource in Home Assistant:

```yaml
url: /local/date-counter.js
type: module
```

3. Restart Home Assistant (or hard reload the frontend).

## Usage

Add a card in Lovelace:

```yaml
type: custom:date-counter-card
title: Seit Projektstart
date: "2025-01-01T08:00"
```

## Configuration Options

- `type` (required): Must be `custom:date-counter-card`
- `title` (optional): Card heading
  - Default: localized by UI language (for example `Time Since Date` in EN, `Zeit seit Datum` in DE)
- `date` (required for display): Start date and time in format `YYYY-MM-DDTHH:mm`
  - Example: `2026-03-17T14:30`

## Notes

- The card uses the local time from the browser/Home Assistant frontend.
- If no valid date is set, an info message is shown.
- Configuration changes are applied immediately.

## Troubleshooting

- Card is not shown:
  - Check that the resource is correctly configured (`/local/date-counter.js`).
  - Check browser console for JavaScript errors.
- Date is not counted:
  - Ensure format `YYYY-MM-DDTHH:mm` is used.
- No visible change after install:
  - Clear browser cache and hard reload the page.

## Language Files

- English: this file
- German: `README.de.md`


[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/HACS-Default-41BDF5?style=flat-square

[release-url]: https://github.com/PaulTubeTV/date-counter/releases
[release-badge]: https://img.shields.io/github/v/release/PaulTubeTV/date-counter?style=flat-square

[downloads-badge]: https://img.shields.io/github/downloads/PaulTubeTV/date-counter/total?style=flat-square

[translations-url]: https://github.com/PaulTubeTV/date-counter/issues
[translations-badge]: https://img.shields.io/badge/i18n-de%20en%20fr%20es%20it%20nl-2ea44f?style=flat-square