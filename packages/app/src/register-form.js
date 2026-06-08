import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromInputs } from "@unbndl/view";

export class RegisterFormElement extends HTMLElement {
  viewModel = createViewModel({
    username: "",
    password: "",
    error: ""
  }).with(fromInputs(this), "username", "password");

  view = html`
    <form>
      <slot></slot>
      ${
        ($) =>
          $.error
            ? html`<p class="error">${$.error}</p>`
            : html``
      }
      <button type="button" class="register-button">
        <slot name="submit-label">Register</slot>
      </button>
    </form>
  `;

  constructor() {
    super();

    shadow(this)
      .styles(RegisterFormElement.styles)
      .replace(this.viewModel.render(this.view));

    const button = this.shadowRoot?.querySelector(".register-button");

    if (button) {
      button.addEventListener("click", () => {
        this.submitRegister(this.getAttribute("api") || "/auth/register");
      });
    }
  }

  async submitRegister(endpoint) {
    this.viewModel.set("error", "");

    const data = this.viewModel.toObject();
    const body = JSON.stringify({
      username: data.username,
      password: data.password
    });

    console.log("register endpoint:", endpoint);
    console.log("register payload:", body);

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
      console.log("register status:", res.status);

      const text = await res.text();
      console.log("register raw response:", text);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(text || `Register failed: Status ${res.status}`);
      }

      window.location.assign("/login.html");
    } catch (error) {
      clearTimeout(timeout);
      console.error("Register failed:", error);
      this.viewModel.set(
        "error",
        error instanceof Error ? error.message : "Registration failed"
      );
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