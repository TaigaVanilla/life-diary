class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    this.createLoginForm();
    this.updateAuthButton();
    this.attachEventListeners();
  }

  createLoginForm() {
    const form = document.createElement("div");
    form.classList.add("hidden");
    form.id = "login-container";
    form.innerHTML = `
            <!-- Animated background blobs -->
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>

            <div class="auth-form">
                <div class="auth-form-content">
                    <h2>Welcome Back</h2>

                    <div class="input-group">
                        <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" id="username" class="auth-input" placeholder="Username" required>
                    </div>

                    <div class="input-group">
                        <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input type="password" id="password" class="auth-input" placeholder="Password" required>
                    </div>

                    <button id="loginButton" class="auth-button login-button">Login</button>
                    <button id="registerButton" class="auth-button register-button">Create Account</button>

                    <p id="authMessage" class="hidden"></p>
                </div>
            </div>
        `;

    document.getElementById("app").appendChild(form);
  }

  attachEventListeners() {
    document
      .getElementById("loginButton")
      .addEventListener("click", () => this.handleLogin());
    document
      .getElementById("registerButton")
      .addEventListener("click", () => this.handleRegister());
  }

  async handleLogin() {
    const loginButton = document.getElementById("loginButton");
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      loginButton.disabled = true;
      loginButton.innerHTML = '<span class="spinner"></span>Logging in...';

      await auth.login(username, password);
      this.showMainContent();
      calendar.loadEntries();
    } catch (error) {
      this.showMessage("Login failed. Please try again.", true);
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  }

  async handleRegister() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      this.showMessage(`${usernameError} ${passwordError}`.trim(), true);
      return;
    }

    try {
      await auth.register(username, password);
      this.showMessage("Registration successful. Please login.", false);
    } catch (error) {
      const errorMessages = JSON.parse(error.message);
      const orderedMessages = [];
      if (errorMessages.username) {
        orderedMessages.push(errorMessages.username);
      }
      if (errorMessages.password) {
        orderedMessages.push(errorMessages.password);
      }
      const errorText = orderedMessages.join(", ");
      this.showMessage(errorText, true);
    }
  }

  async updateAuthButton() {
    const authButtons = document.getElementById("auth-buttons");
    const isAuthenticated = await auth.isAuthenticated();

    authButtons.innerHTML = isAuthenticated
      ? `<button id="logoutButton" class="stylish-button stylish-button-secondary">Logout</button>`
      : `<button id="loginButton" class="stylish-button stylish-button-primary">Login</button>`;

    if (isAuthenticated) {
      document
        .getElementById("logoutButton")
        .addEventListener("click", () => this.handleLogout());
    } else {
      document
        .getElementById("loginButton")
        .addEventListener("click", () => this.showLoginForm());
    }
  }

  async handleLogout() {
    try {
      await auth.logout();
      this.showMessage("Logout successful!", false);
      calendar.loadEntries();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    await this.updateAuthButton();
  }

  showMessage(message, isError) {
    const messageEl = document.getElementById("authMessage");
    messageEl.textContent = message;
    messageEl.classList.remove("hidden");
    messageEl.className = isError ? "error-message" : "success-message";
  }

  showLoginForm() {
    document.getElementById("login-container").classList.remove("hidden");
    document.querySelector("main").classList.add("hidden");
    document.getElementById("auth-buttons").classList.add("hidden");
  }

  showMainContent() {
    document.getElementById("login-container").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    document.getElementById("auth-buttons").classList.remove("hidden");
    this.updateAuthButton();
  }
}
