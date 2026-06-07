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
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>
  `;

  constructor() {
    super();

    shadow(this)
      .styles(LoginFormElement.styles)
      .replace(this.viewModel.render(this.view));

    this.shadowRoot.addEventListener("submit", (event) =>
      this.submitLogin(event, this.getAttribute("api") || "#")
    );
  }

  submitLogin(event, endpoint) {
    event.preventDefault();

    const data = this.viewModel.toObject();
    const method = "POST";
    const headers = {
      "Content-Type": "application/json"
    };
    const body = JSON.stringify(data);

    fetch(endpoint, { method, headers, body })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Form submission failed: Status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        const { token } = json;

        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: "/app" }]
        });

        this.dispatchEvent(customEvent);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
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
  `;
}