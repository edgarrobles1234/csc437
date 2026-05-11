import { html, css, shadow } from "@unbndl/html";
import reset from "/js/reset.js";

export class EdibleCardElement extends HTMLElement {
  static template = html`
    <template>
      <article class="card">
        <div class="card-header">
          <h2 class="title">
            <svg class="icon" aria-hidden="true">
              <use id="icon-use"></use>
            </svg>
            <slot name="title">Untitled</slot>
          </h2>

          <p class="wiki-wrap">
            <a id="wiki-link" target="_blank" rel="noopener noreferrer">Wikipedia</a>
          </p>
        </div>

        <div class="meta-row">
          <slot name="meta"></slot>
        </div>

        <div class="details">
          <p><strong>Scientific Name:</strong> <slot name="scientific-name">Unknown</slot></p>
          <p><strong>Found In:</strong> <slot name="found-in">Unknown</slot></p>
          <p><strong>Safe to Eat:</strong> <slot name="safe-to-eat">Unknown</slot></p>
          <p><strong>Harvest Notes:</strong> <slot name="harvest-notes">None</slot></p>
          <p><strong>Sustainability Notes:</strong> <slot name="sustainability-notes">None</slot></p>
        </div>

        <div class="links-wrap">
          <slot name="links"></slot>
        </div>
      </article>
    </template>
  `;

  constructor() {
    super();
    shadow(this)
      .template(EdibleCardElement.template)
      .styles(reset.styles, EdibleCardElement.styles);
  }

  static observedAttributes = ["icon", "wiki-href"];

  attributeChangedCallback(name, _oldValue, newValue) {
    if (!this.shadowRoot) return;

    if (name === "wiki-href") {
      const link = this.shadowRoot.querySelector("#wiki-link");
      if (link) link.setAttribute("href", newValue || "#");
    }

    if (name === "icon") {
      const use = this.shadowRoot.querySelector("#icon-use");
      if (!use) return;

      let iconId = "icon-leaf";
      if (newValue === "mushroom") iconId = "icon-mushroom";
      if (newValue === "berry") iconId = "icon-berry";
      if (newValue === "leaf") iconId = "icon-leaf";

      use.setAttribute("href", `/icons/foraging.svg#${iconId}`);
    }
  }

  static styles = css`
    :host {
      display: block;
    }

    .card {
      display: grid;
      gap: 16px;
      padding: 24px;
      border: 1px solid var(--sage-pale, #b7c9ab);
      border-radius: 12px;
      background-color: var(--panel-bg, #f7fbf2);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      min-width: 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }

    .title {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--forest-dark, #355e3b);
      font-family: "Fraunces", Georgia, "Times New Roman", serif;
      font-size: 1.4rem;
      line-height: 1.2;
    }

    .wiki-wrap a {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 999px;
      background-color: var(--cream-green, #e7f2dd);
      color: var(--leaf, #6b8e23);
      text-decoration: none;
      font-weight: 700;
    }

    .wiki-wrap a:hover {
      color: var(--forest-dark, #355e3b);
      text-decoration: underline;
    }

    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .details {
      display: grid;
      gap: 10px;
      padding: 14px;
      border-radius: 10px;
      background-color: var(--mint-light, #dce8d5);
    }

    .details p {
      line-height: 1.6;
      color: var(--text-dark, #2f3e2f);
    }

    .details strong {
      color: var(--forest-dark, #355e3b);
    }

    .icon {
      width: 1.4em;
      height: 1.4em;
      vertical-align: text-bottom;
      fill: currentColor;
      flex: 0 0 auto;
    }

    ::slotted(.related-links) {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 0;
      margin: 0;
      background: none;
      border: 0;
    }

    ::slotted(.related-links li) {
      margin: 0;
    }

    @media (max-width: 720px) {
      .card-header {
        flex-direction: column;
      }
    }
  `;
}