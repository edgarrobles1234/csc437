import { html, css, shadow } from "@unbndl/html";
import reset from "/js/reset.js";

function renderJump(edible) {
  return html`
    <li>
      <a href=${`#${edible.id}`}>${edible.title}</a>
    </li>
  `;
}

function renderLinks(links = []) {
  return links.map(
    (link) => html`<li><a href=${link.href}>${link.label}</a></li>`
  );
}

function renderEdible(edible) {
  return html`
    <fg-edible-card
      id=${edible.id}
      icon=${edible.icon}
      wiki-href=${edible.wikiHref}
    >
      <span slot="title">${edible.title}</span>

      <span slot="meta">${edible.type}</span>
      <span slot="meta">${edible.season}</span>

      <span slot="scientific-name">${edible.scientificName}</span>
      <span slot="found-in">${edible.foundIn}</span>
      <span slot="safe-to-eat">${edible.safeToEat}</span>
      <span slot="harvest-notes">${edible.harvestNotes}</span>
      <span slot="sustainability-notes">${edible.sustainabilityNotes}</span>

      <ul slot="links" class="related-links">
        ${renderLinks(edible.links)}
      </ul>
    </fg-edible-card>
  `;
}

export class EdibleListElement extends HTMLElement {
  constructor() {
    super();
    shadow(this).styles(reset.styles, EdibleListElement.styles);
  }

  static observedAttributes = ["src"];

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "src" && newValue) {
      this.hydrate(newValue).then((data) => {
        const view = EdibleListElement.render(data);
        shadow(this).replace(view);
      });
    }
  }

  hydrate(src) {
    return fetch(src)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`HTTP Status ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
        return { edibles: [] };
      });
  }

  static render(data) {
    const edibles = data?.edibles || [];

    return html`
      <section class="wrapper">
        <ul class="jump-list">
          ${edibles.map(renderJump)}
        </ul>

        <section class="edible-list">
          ${edibles.map(renderEdible)}
        </section>
      </section>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .jump-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 0;
      margin: 0;
    }

    .jump-list a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background-color: var(--cream-green);
      color: var(--leaf);
      text-decoration: none;
      font-weight: 700;
    }

    .jump-list a:hover {
      color: var(--forest-dark);
      text-decoration: underline;
    }

    .edible-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    fg-edible-card {
      display: block;
    }

    @media (max-width: 950px) {
      .edible-list {
        grid-template-columns: 1fr;
      }
    }
  `;
}