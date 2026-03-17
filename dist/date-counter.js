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
      title: "Date Counter",
      date: DateCounterCard.getLocalNowValue(),
    };
  }

  setConfig(config) {
    this.config = {
      title: (config && config.title) || "Zeit seit Datum",
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
      this.timeContainer.innerHTML = "<p>Bitte Datum in der Kartenkonfiguration setzen.</p>";
      return;
    }

    const now = new Date();
    const diffMs = now - this.selectedDate;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    this.timeContainer.innerHTML = `
      <p><b>${days}</b> Tage</p>
      <p><b>${hours % 24}</b> Stunden</p>
      <p><b>${minutes % 60}</b> Minuten</p>
      <p><b>${seconds % 60}</b> Sekunden</p>
    `;
  }

  render() {
    if (!this.config) return;

    this.innerHTML = `
      <ha-card>
        <div style="padding:16px">
          <h3>${this.config.title}</h3>
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
    const nextConfig = {
      type: safeConfig.type || DateCounterCard.getCardType(),
      title: typeof safeConfig.title === "string" ? safeConfig.title : "Zeit seit Datum",
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

    this.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; padding:8px 0;">
        <label style="display:flex; flex-direction:column; gap:4px;">
          <span>Titel</span>
          <input id="title" type="text" value="${this.config.title}" placeholder="z. B. Seit Hochzeit" />
        </label>

        <div style="display:grid; grid-template-columns: 1fr 140px; gap:8px;">
          <label style="display:flex; flex-direction:column; gap:4px;">
            <span>Datum</span>
            <input id="date" type="date" value="${dateValue}" />
          </label>

          <label style="display:flex; flex-direction:column; gap:4px;">
            <span>Uhrzeit</span>
            <input id="time" type="time" step="60" value="${timeValue}" />
          </label>
        </div>

        <small style="opacity:0.75;">Datum und Uhrzeit werden nur hier in der Konfiguration gesetzt.</small>
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
  description: "Zeigt die vergangene Zeit seit einem Datum",
  preview: true,
});