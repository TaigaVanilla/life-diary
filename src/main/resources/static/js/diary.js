class DiaryManager {
  constructor() {
    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById("closeDiary").addEventListener("click", () => {
      document.getElementById("diary-container").classList.add("hidden");
    });

    document.getElementById("saveDiary").addEventListener("click", async () => {
      const dateString = calendar.selectedDate;
      const content = document.getElementById("diaryText").value;

      try {
        await api.saveDiaryEntry(dateString, content);
        calendar.loadEntries();

        const saveBtn = document.getElementById("saveDiary");
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "Saved！";
        setTimeout(() => {
          saveBtn.textContent = originalText;
        }, 2000);
      } catch (error) {
        const errorMessages = JSON.parse(error.message);
        const orderedMessages = [];
        if (errorMessages.date) {
          orderedMessages.push(errorMessages.date);
        }
        if (errorMessages.content) {
          orderedMessages.push(errorMessages.content);
        }
        const errorText = orderedMessages.join(", ");
        alert(errorText);
      }
    });
  }
}
