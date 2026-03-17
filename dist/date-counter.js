class DateCounterCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("date-counter-card-editor");
  }

  static getStubConfig() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    return {
      title: "Date Counter",
      date: local,
    };
  }

  setConfig(config) {
    if (!config || !config.date) {
      throw new Error("Bitte ein Datum konfigurieren.");
    }

    this.config = {
      title: config.title || "Zeit seit Datum",
      date: config.date,
    };

    this.selectedDate = new Date(this.config.date);
    if (Number.isNaN(this.selectedDate.getTime())) {
      throw new Error("Ungültiges Datum in der Karten-Konfiguration.");
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
    if (!this.selectedDate || !this.timeContainer) return;

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
  setConfig(config) {
    this.config = {
      title: config.title || "Zeit seit Datum",
      date: config.date || "",
    };
    this.render();
  }

  render() {
    if (!this.config) return;

    this.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; padding:8px 0;">
        <label style="display:flex; flex-direction:column; gap:4px;">
          <span>Titel</span>
          <input id="title" type="text" value="${this.config.title}" />
        </label>

        <label style="display:flex; flex-direction:column; gap:4px;">
          <span>Datum</span>
          <input id="date" type="datetime-local" value="${this.config.date}" />
        </label>
      </div>
    `;

    this.querySelector("#title").addEventListener("input", (e) => {
      this.updateConfig({ title: e.target.value });
    });

    this.querySelector("#date").addEventListener("change", (e) => {
      this.updateConfig({ date: e.target.value });
    });
  }

  updateConfig(changed) {
    const config = { ...this.config, ...changed };
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