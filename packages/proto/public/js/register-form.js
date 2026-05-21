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
      <p class="error">${($) => $.error}</p>
      <button type="submit">
        <slot name="submit-label">Register</slot>
      </button>
    </form>
  `;

  constructor() {
  super();

  shadow(this)
    .styles(RegisterFormElement.styles)
    .replace(this.viewModel.render(this.view));

  this.shadowRoot.addEventListener("submit", (event) =>
    this.submitRegister(event, this.getAttribute("api") || "#")
  );
}

  submitRegister(event, endpoint) {
    event.preventDefault();
    this.viewModel.set("error", "");

    const data = this.viewModel.toObject();

    const body = JSON.stringify({
      username: data.username,
      password: data.password
    });

    console.log("Submitting register form:", endpoint, body);

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    })
      .then((res) => {
        console.log("Register status:", res.status);

        if (res.status !== 201) {
          return res.text().then((text) => {
            throw new Error(text || `Registration failed: ${res.status}`);
          });
        }

        return res.json();
      })
      .then((json) => {
        console.log("Register success:", json);

        const { token } = json;

        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: "/edibles.html" }]
        });

        this.dispatchEvent(customEvent);
      })
      .catch((error) => {
        console.error("Register failed:", error);
        this.viewModel.set("error", error.message);
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

    .error {
      color: #b00020;
      min-height: 1.25rem;
      margin: 0;
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