class DiaryExtractor {
  constructor() {
    this.init();
  }

  init() {
    this.createExtractorUI();
    this.attachEventListeners();
  }

  createExtractorUI() {
    const container = document.createElement("div");
    container.id = "extractor-container";
    container.innerHTML = `
            <div class="extractor-header">
                <h2>Extract Diary Entries</h2>
                <select id="extractRange">
                    <option value="custom">Custom Range</option>
                    <option value="all">All Entries</option>
                </select>
                <div id="dateRangeInputs">
                    <div id="dateInputsContainer">
                        <input type="date" id="startDate">
                        <span>to</span>
                        <input type="date" id="endDate">
                    </div>
                    <button id="extractButton">Extract</button>
                </div>
            </div>
            <div id="extractResults" class="hidden">
                <div class="results-header">
                    <h3>Extracted Entries</h3>
                    <button id="closeResults">×</button>
                </div>
                <div id="entriesList"></div>
            </div>
        `;

    // Insert after the diary container
    const diaryContainer = document.getElementById("diary-container");
    diaryContainer.parentNode.insertBefore(
      container,
      diaryContainer.nextSibling,
    );
  }

  attachEventListeners() {
    const extractRange = document.getElementById("extractRange");
    const dateInputsContainer = document.getElementById("dateInputsContainer");
    const extractButton = document.getElementById("extractButton");
    const closeResults = document.getElementById("closeResults");

    extractRange.addEventListener("change", (e) => {
      dateInputsContainer.style.display =
        e.target.value === "all" ? "none" : "flex";
    });

    extractButton.addEventListener("click", () => this.extractEntries());

    closeResults.addEventListener("click", () => {
      document.getElementById("extractResults").classList.add("hidden");
    });

    // Set default dates
    const today = new Date();
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");

    startDate.value = this.formatDate(
      new Date(today.getFullYear(), today.getMonth(), 1),
    );
    endDate.value = this.formatDate(today);
  }

  formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  async extractEntries() {
    const extractRange = document.getElementById("extractRange");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");

    let params;
    if (extractRange.value === "all") {
      params = "all=true";
    } else {
      params = `startDate=${startDate.value}&endDate=${endDate.value}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/diary/extract?${params}`);
      const entries = await response.json();
      this.displayEntries(entries);
    } catch (error) {
      console.error("Failed to extract entries:", error);
      alert("Failed to extract diary entries.");
    }
  }

  displayEntries(entries) {
    const entriesList = document.getElementById("entriesList");
    entriesList.innerHTML = "";

    if (entries.length === 0) {
      entriesList.innerHTML =
        '<p class="no-entries">No entries found for the selected period.</p>';
    } else {
      entries.forEach((entry) => {
        const entryElement = document.createElement("div");
        const [year, month, day] = entry.date.split("-");
        const formattedDate = `${parseInt(month)}/${parseInt(day)}/${year}`;
        entryElement.className = "entry-item";
        entryElement.innerHTML = `
                    <div class="entry-date">${formattedDate}</div>
                    <div class="entry-content">${entry.content}</div>
                `;
        entriesList.appendChild(entryElement);
      });
    }

    document.getElementById("extractResults").classList.remove("hidden");
  }
}
