function validateUsername(username) {
  if (!username || username.length < 3 || username.length > 50) {
    return "Username must be between 3 and 50 characters.";
  }
  return "";
}

function validatePassword(password) {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return "";
}

function validateDate(date) {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !datePattern.test(date)) {
    return "Please enter a valid date in YYYY-MM-DD format.";
  }
  return "";
}

function validateContent(content) {
  if (content && content.length > 5000) {
    return "Content must be at most 5000 characters long.";
  }
  return "";
}
