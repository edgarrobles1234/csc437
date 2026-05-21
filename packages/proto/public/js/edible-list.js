import { html, css, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

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
  viewModel = createViewModel({
    src: "",
    authenticated: false,
    token: undefined,
    edibles: []
  })
    .with(fromAttributes(this), "src")
    .with(fromAuth(this), "authenticated", "token");

  view = html`
    <section class="wrapper">
      <section class="edible-list">
        ${($) => $.edibles.map(renderEdible)}
      </section>
    </section>
  `;

  constructor() {
    super();

    shadow(this)
      .styles(EdibleListElement.styles)
      .replace(this.viewModel.render(this.view));

    this.viewModel.createEffect(($) => {
      if ($.authenticated && $.src) {
        this.hydrate($.src).then((data) => {
          this.viewModel.set("edibles", data.edibles || []);
        });
      }
    });
  }

  get authorization() {
    const $ = this.viewModel.toObject();

    if ($.authenticated) {
      return {
        Authorization: `Bearer ${$.token}`
      };
    }

    return {};
  }

  hydrate(src) {
    return fetch(src, { headers: this.authorization }).then((res) => {
      if (res.status !== 200) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      return res.json();
    });
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

    .edible-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    @media (max-width: 950px) {
      .edible-list {
        grid-template-columns: 1fr;
      }
    }
  `;
}