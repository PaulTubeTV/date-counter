class DateCounterCard extends HTMLElement {
  setConfig(config) {
    this.config = {
      title: config.title || "Zeit seit Datum",
      date: config.date || null,
    };
  }

  connectedCallback() {
    this.render();
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  updateTime() {
    if (!this.selectedDate) return;

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
    this.innerHTML = `
      <ha-card>
        <div style="padding:16px">
          <h3>${this.config.title}</h3>
          
          <input type="datetime-local" id="dateInput" style="width:100%; margin-bottom:10px;" />
          
          <div id="time"></div>
        </div>
      </ha-card>
    `;

    this.dateInput = this.querySelector("#dateInput");
    this.timeContainer = this.querySelector("#time");

    // gespeichertes Datum laden
    const saved = localStorage.getItem(this.getStorageKey());
    if (saved) {
      this.dateInput.value = saved;
      this.selectedDate = new Date(saved);
    } else if (this.config.date) {
      this.dateInput.value = this.config.date;
      this.selectedDate = new Date(this.config.date);
    }

    this.dateInput.addEventListener("change", (e) => {
      const value = e.target.value;
      this.selectedDate = new Date(value);
      localStorage.setItem(this.getStorageKey(), value);
      this.updateTime();
    });

    this.updateTime();
  }

  getStorageKey() {
    return `date-counter-${this.config.title}`;
  }
}

customElements.define("date-counter-card", DateCounterCard);