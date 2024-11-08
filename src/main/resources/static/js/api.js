const API_BASE_URL = "http://localhost:8080/api";

const api = {
  async getDiaryEntry(date) {
    const response = await fetch(`${API_BASE_URL}/diary/${date}`);
    if (response.status === 204) {
      return null;
    }
    if (!response.ok) {
      return null;
    }
    return response.json();
  },

  async saveDiaryEntry(date, content) {
    if (!(await auth.isAuthenticated())) {
      alert("Login is required.");
      this.showLoginForm();
      return;
    }

    const dateError = validateDate(date);
    const contentError = validateContent(content);

    if (dateError || contentError) {
      alert(`${dateError} ${contentError}`.trim());
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/diary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, content }),
      });
      if (response.status === 204) {
        return null;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      return response.json();
    } catch (error) {
      console.error("Failed to save entry:", error);
      alert("Failed to save entry. Please try again.");
    }
  },

  async getDiaryEntriesForMonth(year, month) {
    const response = await fetch(
      `${API_BASE_URL}/diary/month/${year}/${month}`,
    );
    return response.json();
  },

  async extractDiaryEntries(params) {
    const response = await fetch(`${API_BASE_URL}/diary/extract?${params}`);
    return response.json();
  },

  showLoginForm() {
    document.getElementById("login-container").classList.remove("hidden");
    document.querySelector("main").classList.add("hidden");
    document.getElementById("auth-buttons").classList.add("hidden");
  },
};

const auth = {
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }
  },

  async register(username, password) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
  },

  async logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  async isAuthenticated() {
    try {
      const response = await fetch("/api/auth/check");
      return response.ok;
    } catch (error) {
      return false;
    }
  },
};
