const DATE_COUNTER_TRANSLATIONS = {
  en: {
    default_title: "Time Since Date",
    missing_date: "Please set a date in the card configuration.",
    units: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    editor: {
      title: "Title",
      title_placeholder: "e.g. Since wedding",
      date: "Date",
      time: "Time",
      help: "Date and time are only set here in the configuration.",
    },
  },
  de: {
    default_title: "Zeit seit Datum",
    missing_date: "Bitte Datum in der Kartenkonfiguration setzen.",
    units: {
      days: "Tage",
      hours: "Stunden",
      minutes: "Minuten",
      seconds: "Sekunden",
    },
    editor: {
      title: "Titel",
      title_placeholder: "z. B. Seit Hochzeit",
      date: "Datum",
      time: "Uhrzeit",
      help: "Datum und Uhrzeit werden nur hier in der Konfiguration gesetzt.",
    },
  },
  fr: {
    default_title: "Temps depuis la date",
    missing_date: "Veuillez definir une date dans la configuration de la carte.",
    units: {
      days: "Jours",
      hours: "Heures",
      minutes: "Minutes",
      seconds: "Secondes",
    },
    editor: {
      title: "Titre",
      title_placeholder: "ex. Depuis le mariage",
      date: "Date",
      time: "Heure",
      help: "La date et l'heure sont definies uniquement ici dans la configuration.",
    },
  },
  es: {
    default_title: "Tiempo desde la fecha",
    missing_date: "Configura una fecha en la configuracion de la tarjeta.",
    units: {
      days: "Dias",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    },
    editor: {
      title: "Titulo",
      title_placeholder: "p. ej. Desde la boda",
      date: "Fecha",
      time: "Hora",
      help: "La fecha y la hora solo se configuran aqui.",
    },
  },
  it: {
    default_title: "Tempo dalla data",
    missing_date: "Imposta una data nella configurazione della scheda.",
    units: {
      days: "Giorni",
      hours: "Ore",
      minutes: "Minuti",
      seconds: "Secondi",
    },
    editor: {
      title: "Titolo",
      title_placeholder: "es. Dal matrimonio",
      date: "Data",
      time: "Ora",
      help: "Data e ora vengono impostate solo qui nella configurazione.",
    },
  },
  nl: {
    default_title: "Tijd sinds datum",
    missing_date: "Stel een datum in de kaartconfiguratie in.",
    units: {
      days: "Dagen",
      hours: "Uren",
      minutes: "Minuten",
      seconds: "Seconden",
    },
    editor: {
      title: "Titel",
      title_placeholder: "bijv. Sinds bruiloft",
      date: "Datum",
      time: "Tijd",
      help: "Datum en tijd worden alleen hier in de configuratie ingesteld.",
    },
  },
};

function getLanguageCode(hass) {
  const rawLanguage =
    (hass && (hass.language || (hass.locale && hass.locale.language))) ||
    (typeof navigator !== "undefined" ? navigator.language : "") ||
    "en";
  const normalized = String(rawLanguage).toLowerCase();
  const baseLanguage = normalized.split("-")[0];

  return DATE_COUNTER_TRANSLATIONS[baseLanguage] ? baseLanguage : "en";
}

function translate(hass, key) {
  const language = getLanguageCode(hass);
  const en = DATE_COUNTER_TRANSLATIONS.en || {};
  const de = DATE_COUNTER_TRANSLATIONS.de || {};
  const source = DATE_COUNTER_TRANSLATIONS[language] || en;
  const parts = key.split(".");
  const readPath = (obj) => {
    let current = obj;
    for (const part of parts) {
      if (!current || typeof current !== "object" || !(part in current)) {
        return undefined;
      }
      current = current[part];
    }
    return current;
  };

  return readPath(source) || readPath(en) || readPath(de) || key;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hasCustomTitle(value) {
  return typeof value === "string" && value.trim().length > 0;
}

class DateCounterCard extends HTMLElement {
  static getCardType() {
    return "custom:date-counter-card";
  }

  static getLocalNowValue() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }

  static getConfigElement() {
    return document.createElement("date-counter-card-editor");
  }

  static getStubConfig() {
    return {
      type: DateCounterCard.getCardType(),
      title: "",
      date: DateCounterCard.getLocalNowValue(),
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (this.config && !this.hasCustomTitle) {
      this.config.title = translate(this._hass, "default_title");
    }
    if (this.isConnected) {
      this.render();
      this.updateTime();
    }
  }

  setConfig(config) {
    const customTitle = hasCustomTitle(config && config.title);
    this.hasCustomTitle = customTitle;
    this.config = {
      title: customTitle ? config.title : translate(this._hass, "default_title"),
      date: (config && config.date) || "",
    };

    this.selectedDate = this.config.date ? new Date(this.config.date) : null;
    if (this.selectedDate && Number.isNaN(this.selectedDate.getTime())) {
      this.selectedDate = null;
    }

    if (this.isConnected) {
      this.render();
      this.updateTime();
    }
  }

  connectedCallback() {
    this.render();
    this.updateTime();
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  updateTime() {
    if (!this.timeContainer) return;

    if (!this.selectedDate) {
      this.timeContainer.innerHTML = `<p>${escapeHtml(translate(this._hass, "missing_date"))}</p>`;
      return;
    }

    const now = new Date();
    const diffMs = now - this.selectedDate;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const daysLabel = translate(this._hass, "units.days");
    const hoursLabel = translate(this._hass, "units.hours");
    const minutesLabel = translate(this._hass, "units.minutes");
    const secondsLabel = translate(this._hass, "units.seconds");

    this.timeContainer.innerHTML = `
      <p><b>${days}</b> ${escapeHtml(daysLabel)}</p>
      <p><b>${hours % 24}</b> ${escapeHtml(hoursLabel)}</p>
      <p><b>${minutes % 60}</b> ${escapeHtml(minutesLabel)}</p>
      <p><b>${seconds % 60}</b> ${escapeHtml(secondsLabel)}</p>
    `;
  }

  render() {
    if (!this.config) return;

    this.innerHTML = `
      <ha-card>
        <div style="padding:16px">
          <h3>${escapeHtml(this.config.title)}</h3>
          <div id="time"></div>
        </div>
      </ha-card>
    `;

    this.timeContainer = this.querySelector("#time");
  }
}

class DateCounterCardEditor extends HTMLElement {
  static isSameConfig(left, right) {
    return (
      left &&
      right &&
      left.type === right.type &&
      left.title === right.title &&
      left.date === right.date
    );
  }

  setConfig(config) {
    const titleInput = this.querySelector("#title");
    const titleHadFocus = titleInput && document.activeElement === titleInput;
    const selectionStart = titleHadFocus ? titleInput.selectionStart : null;
    const selectionEnd = titleHadFocus ? titleInput.selectionEnd : null;

    const safeConfig = config || {};
    const customTitle = hasCustomTitle(safeConfig.title);
    this.hasCustomTitle = customTitle;
    const nextConfig = {
      type: safeConfig.type || DateCounterCard.getCardType(),
      title: customTitle ? safeConfig.title : translate(this._hass, "default_title"),
      date: typeof safeConfig.date === "string" ? safeConfig.date : DateCounterCard.getLocalNowValue(),
    };
    const shouldRender = !DateCounterCardEditor.isSameConfig(this.config, nextConfig);

    this.config = nextConfig;
    if (shouldRender) {
      this.render();

      if (titleHadFocus) {
        const refreshedTitleInput = this.querySelector("#title");
        if (refreshedTitleInput) {
          refreshedTitleInput.focus();
          if (typeof selectionStart === "number" && typeof selectionEnd === "number") {
            refreshedTitleInput.setSelectionRange(selectionStart, selectionEnd);
          }
        }
      }
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (this.config && !this.hasCustomTitle) {
      this.config.title = translate(this._hass, "default_title");
    }
    if (this.isConnected) {
      this.render();
    }
  }

  static splitDateTime(value) {
    if (typeof value !== "string" || !value.includes("T")) {
      return { dateValue: "", timeValue: "" };
    }

    const [dateValue, timeRaw] = value.split("T");
    const timeValue = (timeRaw || "").slice(0, 5);

    return {
      dateValue: /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? dateValue : "",
      timeValue: /^\d{2}:\d{2}$/.test(timeValue) ? timeValue : "",
    };
  }

  updateDateTimeFromFields() {
    const dateInput = this.querySelector("#date");
    const timeInput = this.querySelector("#time");

    if (!dateInput || !timeInput) return;

    const dateValue = dateInput.value || "";
    const timeValue = timeInput.value || "00:00";

    if (!dateValue) {
      this.updateConfig({ date: "" });
      return;
    }

    this.updateConfig({ date: `${dateValue}T${timeValue}` });
  }

  render() {
    if (!this.config) return;

    const { dateValue, timeValue } = DateCounterCardEditor.splitDateTime(this.config.date);
    const titleLabel = translate(this._hass, "editor.title");
    const titlePlaceholder = translate(this._hass, "editor.title_placeholder");
    const dateLabel = translate(this._hass, "editor.date");
    const timeLabel = translate(this._hass, "editor.time");
    const helpText = translate(this._hass, "editor.help");

    this.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; padding:8px 0;">
        <label style="display:flex; flex-direction:column; gap:4px;">
          <span>${escapeHtml(titleLabel)}</span>
          <input id="title" type="text" value="${escapeHtml(this.config.title)}" placeholder="${escapeHtml(titlePlaceholder)}" />
        </label>

        <div style="display:grid; grid-template-columns: 1fr 140px; gap:8px;">
          <label style="display:flex; flex-direction:column; gap:4px;">
            <span>${escapeHtml(dateLabel)}</span>
            <input id="date" type="date" value="${dateValue}" />
          </label>

          <label style="display:flex; flex-direction:column; gap:4px;">
            <span>${escapeHtml(timeLabel)}</span>
            <input id="time" type="time" step="60" value="${timeValue}" />
          </label>
        </div>

        <small style="opacity:0.75;">${escapeHtml(helpText)}</small>
      </div>
    `;

    this.querySelector("#title").addEventListener("input", (e) => {
      this.updateConfig({ title: e.target.value });
    });

    this.querySelector("#date").addEventListener("change", () => {
      this.updateDateTimeFromFields();
    });

    this.querySelector("#time").addEventListener("change", () => {
      this.updateDateTimeFromFields();
    });
  }

  updateConfig(changed) {
    if (!this.config) return;

    const config = { ...this.config, ...changed };
    config.type = config.type || DateCounterCard.getCardType();
    config.title = typeof config.title === "string" ? config.title : "";
    config.date = typeof config.date === "string" ? config.date : "";
    this.config = config;

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("date-counter-card", DateCounterCard);
customElements.define("date-counter-card-editor", DateCounterCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "date-counter-card",
  name: "Date Counter",
  description: "Shows elapsed time since a date",
  preview: true,
});