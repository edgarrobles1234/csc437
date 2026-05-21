import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

export class HeaderElement extends HTMLElement {
  viewModel = createViewModel({
    authenticated: false,
    username: ""
  }).with(fromAuth(this), "authenticated", "username");

  view = html`
    <header class="site-header">
      <div class="site-brand">
        <h1><a href="/index.html">Foraging Guide</a></h1>
      </div>

      <nav class="site-nav" aria-label="Main navigation">
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/edibles.html">Edibles</a></li>
          <li><a href="/fish.html">Fishing</a></li>
          <li><a href="/locations.html">Locations</a></li>
          <li><a href="/safety.html">Safety</a></li>
        </ul>
      </nav>

      <div class=${($) => ($.authenticated ? "account logged-in" : "account logged-out")}>
        <p>Hello, ${($) => $.username || "traveler"}</p>
        <menu>
          <li class="when-signed-in">
            <button type="button">Sign Out</button>
          </li>
          <li class="when-signed-out">
            <a href="/login.html">Sign In</a>
          </li>
        </menu>
      </div>
    </header>
  `;

  constructor() {
    super();

    shadow(this)
      .styles(HeaderElement.styles)
      .replace(this.viewModel.render(this.view))
      .delegate(".when-signed-in button", {
        click: () => this.signout()
      });
  }

  signout() {
    const customEvent = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"]
    });

    this.dispatchEvent(customEvent);
  }

  static styles = css`
    :host {
      display: block;
    }

    .site-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      flex-wrap: wrap;
      padding: 24px;
      background-color: var(--forest-dark);
      color: var(--text-light);
      border-bottom: 5px solid var(--sage-light);
    }

    .site-brand h1 {
      margin: 0;
      font-family: "Fraunces", Georgia, "Times New Roman", serif;
      font-size: 2rem;
      line-height: 1.2;
    }

    .site-brand a {
      color: inherit;
      text-decoration: none;
    }

    .site-nav ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 0;
      margin: 0;
    }

    .site-nav a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border-radius: 999px;
      background-color: var(--cream-green);
      color: var(--text-dark);
      font-weight: 700;
      text-decoration: none;
    }

    .site-nav a:hover {
      text-decoration: underline;
    }

    .account {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .account p {
      margin: 0;
      padding: 0;
      background: none;
      color: inherit;
    }

    menu {
      list-style: none;
      display: flex;
      gap: 12px;
      padding: 0;
      margin: 0;
      align-items: center;
    }

    li {
      display: none;
    }

    .logged-in .when-signed-in,
    .logged-out .when-signed-out {
      display: block;
    }

    button {
      padding: 8px 12px;
      border: 0;
      border-radius: 999px;
      background-color: var(--cream-green);
      color: var(--text-dark);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .when-signed-out a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border-radius: 999px;
      background-color: var(--cream-green);
      color: var(--text-dark);
      font-weight: 700;
      text-decoration: none;
    }

    @media (max-width: 720px) {
      .site-header {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `;
}