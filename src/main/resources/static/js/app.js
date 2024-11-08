document.addEventListener("DOMContentLoaded", () => {
  window.authManager = new AuthManager();
  window.calendar = new Calendar();
  new DiaryManager();
  new DiaryExtractor();
});
