import { html, css, shadow } from "@unbndl/html";

export class MetaPillElement extends HTMLElement {
  static template = html`
    <template>
      <p class="pill">
        <strong><slot name="label">Label</slot></strong>
        <span><slot>Value</slot></span>
      </p>
    </template>
  `;

  constructor() {
    super();
    shadow(this)
      .template(MetaPillElement.template)
      .styles(MetaPillElement.styles);
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    .pill {
      margin: 0;
      padding: 8px 12px;
      background-color: var(--cream-green, #e7f2dd);
      border-radius: 999px;
      color: var(--text-dark, #2f3e2f);
    }

    strong {
      margin-right: 0.25rem;
    }
  `;
}