class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.entries = new Set();

    this.init();
  }

  init() {
    this.renderCalendar();
    this.attachEventListeners();
    this.loadEntries();
  }

  async loadEntries() {
    try {
      const entries = await api.getDiaryEntriesForMonth(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
      );
      this.entries = new Set(entries.map((entry) => entry.date));
      this.renderCalendar();
    } catch (error) {
      console.error("Failed to load entries:", error);
      this.entries = new Set();
      this.renderCalendar();
    }
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    document.getElementById("currentMonth").textContent =
      `${this.getMonthName(month)} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendarGrid = document.querySelector(".calendar-grid");
    const existingDays = calendarGrid.querySelectorAll(".calendar-day");
    existingDays.forEach((day) => day.remove());

    for (let i = 0; i < startingDay; i++) {
      calendarGrid.appendChild(this.createDayElement(""));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = this.formatDateString(year, month, day);
      const dayElement = this.createDayElement(day);

      this.applyDayStyles(dayElement, dateString);

      calendarGrid.appendChild(dayElement);
    }
  }

  applyDayStyles(dayElement, dateString) {
    if (this.entries.has(dateString)) {
      dayElement.classList.add("has-entry");
    } else {
      dayElement.classList.remove("has-entry");
    }

    if (
      this.isToday(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        parseInt(dateString.split("-")[2]),
      )
    ) {
      dayElement.classList.add("today");
    }

    if (dateString === this.selectedDate) {
      dayElement.classList.add("selected");
    }

    dayElement.dataset.date = dateString;
    dayElement.addEventListener("click", () => this.selectDate(dateString));
  }

  formatDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  getMonthName(month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }
  createDayElement(content) {
    const div = document.createElement("div");
    div.className = "calendar-day";
    div.textContent = content;
    return div;
  }

  isToday(year, month, day) {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  }

  async selectDate(dateString) {
    // Remove previous selection
    const previouslySelected = document.querySelector(".calendar-day.selected");
    if (previouslySelected) {
      previouslySelected.classList.remove("selected");
    }

    // Add selection to new date
    const newlySelected = document.querySelector(
      `.calendar-day[data-date="${dateString}"]`,
    );
    if (newlySelected) {
      newlySelected.classList.add("selected");
    }

    this.selectedDate = dateString;
    const [year, month, day] = dateString.split("-");
    const formattedDate = `${parseInt(month)}/${parseInt(day)}/${year}`;
    document.getElementById("selectedDate").textContent =
      `Diary for ${formattedDate}`;

    const diaryContainer = document.getElementById("diary-container");
    diaryContainer.classList.remove("hidden");

    if (await auth.isAuthenticated()) {
      await this.loadDiaryContent(dateString);
    }

    // Scroll and focus handling
    diaryContainer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      const diaryText = document.getElementById("diaryText");
      if (diaryText) {
        diaryText.focus();
      }
    }, 500);
  }

  async loadDiaryContent(dateString) {
    const entry = await api.getDiaryEntry(dateString);
    const diaryText = document.getElementById("diaryText");
    diaryText.value = entry ? entry.content : "";

    // Position cursor at the end of the text
    const textLength = diaryText.value.length;
    diaryText.setSelectionRange(textLength, textLength);
  }

  attachEventListeners() {
    document.getElementById("prevMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
      this.loadEntries();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
      this.loadEntries();
    });
  }
}
