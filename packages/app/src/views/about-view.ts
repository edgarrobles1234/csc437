import { css, html, shadow } from "@unbndl/html";

export class AboutViewElement extends HTMLElement {
  static template = html`
    <template>
      <main>
        <h1>About</h1>
        <p>This is a second route.</p>
        <a href="/app">Back Home</a>
      </main>
    </template>
  `;

  static styles = css`
    :host {
      display: block;
    }

    main {
      padding: 1rem;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(AboutViewElement.template)
      .styles(AboutViewElement.styles);
  }
}