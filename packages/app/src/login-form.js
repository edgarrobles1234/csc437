import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromInputs } from "@unbndl/view";

export class LoginFormElement extends HTMLElement {
  viewModel = createViewModel({
    username: "",
    password: ""
  }).with(fromInputs(this), "username", "password");

  view = html`
    <form>
      <slot></slot>
      <button type="button" class="login-button">
        <slot name="submit-label">Login</slot>
      </button>
      <p class="error" hidden></p>
    </form>
  `;

  constructor() {
    super();

    shadow(this)
      .styles(LoginFormElement.styles)
      .replace(this.viewModel.render(this.view));

    const button = this.shadowRoot?.querySelector(".login-button");
    if (button) {
      button.addEventListener("click", () => {
        this.submitLogin(this.getAttribute("api") || "/auth/login");
      });
    }
  }

  async submitLogin(endpoint) {
    const errorEl = this.shadowRoot?.querySelector(".error");
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }

    const data = this.viewModel.toObject();
    const body = JSON.stringify({
      username: data.username,
      password: data.password
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body,
        signal: controller.signal
      });

      clearTimeout(timeout);

      const text = await res.text();

      if (res.status !== 200) {
        throw new Error(text || `Login failed: Status ${res.status}`);
      }

      const json = text ? JSON.parse(text) : {};
      const { token } = json;

      if (!token) {
        throw new Error("Login succeeded but no token was returned");
      }

      const customEvent = new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signin", { token, redirect: "/app" }]
      });

      this.dispatchEvent(customEvent);
    } catch (error) {
      clearTimeout(timeout);

      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent =
          error instanceof Error ? error.message : "Login failed";
      }

      console.error("Login failed:", error);
    }
  }

  static styles = css`
    form {
      display: grid;
      gap: 16px;
    }

    ::slotted(.form-field) {
      display: grid;
      gap: 8px;
    }

    button {
      padding: 10px 14px;
      border: 0;
      border-radius: 999px;
      background-color: var(--cream-green);
      color: var(--text-dark);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .error {
      color: #8b1e1e;
      font-weight: 700;
      margin: 0;
    }
  `;
}