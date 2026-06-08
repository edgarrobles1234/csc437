import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore } from "@unbndl/store";
import { Model } from "../model.ts";

type EdiblesViewModel = {
  edibles?: Model["edibles"];
};

function edibleName(edible: any) {
  return edible.name ?? edible.title ?? "Untitled";
}

function renderEdible(edible: any) {
  return html`
    <edible-card
      id=${edible.id ?? ""}
      icon=${edible.icon ?? "leaf"}
      wiki-href=${edible.wikiHref ?? "#"}
    >
      <span slot="title">${edibleName(edible)}</span>
      <span slot="meta">${edible.type ?? "Unknown type"}</span>
      <span slot="meta">${edible.season ?? "Unknown season"}</span>
      <span slot="scientific-name">${edible.scientificName ?? "Unknown"}</span>
      <span slot="found-in">${edible.foundIn ?? "Unknown"}</span>
      <span slot="safe-to-eat">${edible.safeToEat ?? "Unknown"}</span>
      <span slot="harvest-notes">${edible.harvestNotes ?? "None"}</span>
      <span slot="sustainability-notes">${edible.sustainabilityNotes ?? "None"}</span>
    </edible-card>
  `;
}

export class EdiblesViewElement extends HTMLElement {
  viewModel = createViewModel<EdiblesViewModel>({})
    .with(fromStore<Model>(this), "edibles");

  private requested = false;

  view = html`
    <main class="page-shell">
      <div class="page-grid">
        <section class="content-stack">
          <section class="intro-panel">
            <h2>Edible Plants &amp; Mushrooms</h2>
            <p>
              This page represents edible plants and mushrooms that can be
              foraged. It includes example items, where they are found, when
              they can be harvested, and how to gather them safely and
              sustainably.
            </p>
          </section>

          ${
            ($: EdiblesViewModel) =>
              $.edibles === undefined
                ? html`<p>Loading edibles...</p>`
                : $.edibles.length === 0
                  ? html`<p>No edibles found.</p>`
                  : html`
                      <section class="card-grid">
                        ${$.edibles.map(renderEdible)}
                      </section>
                    `
          }
        </section>

        <aside class="sidebar-stack">
          <section class="sidebar-card">
            <h3>Reminder</h3>
            <p>
              Never eat wild foods unless you are fully sure of the
              identification.
            </p>
          </section>
        </aside>
      </div>
    </main>
  `;

  static styles = css`
    :host {
      display: block;
      font-family: "Inter", Arial, sans-serif;
      color: #2f3e2f;
    }

    .page-shell {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 20px 40px;
    }

    .page-grid {
      display: grid;
      grid-template-columns: minmax(0, 2.1fr) minmax(260px, 0.9fr);
      gap: 24px;
      align-items: start;
    }

    .content-stack,
    .sidebar-stack {
      display: grid;
      gap: 20px;
    }

    .intro-panel,
    .sidebar-card {
      background: #f7fbf2;
      border: 1px solid #d7e4ce;
      border-radius: 14px;
      padding: 20px;
    }

    .intro-panel h2,
    .sidebar-card h3 {
      margin: 0 0 10px;
      color: #355e3b;
      font-family: "Fraunces", Georgia, serif;
      line-height: 1.15;
    }

    .intro-panel p,
    .sidebar-card p {
      margin: 0;
      line-height: 1.6;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    @media (max-width: 950px) {
      .card-grid,
      .page-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  constructor() {
    super();

    shadow(this)
      .styles(EdiblesViewElement.styles)
      .replace(this.viewModel.render(this.view));
  }

  connectedCallback() {
    this.viewModel.createEffect(($) => {
      if (this.isConnected && $.edibles === undefined && !this.requested) {
        this.requested = true;

        this.dispatchEvent(
          new CustomEvent("store:message", {
            bubbles: true,
            composed: true,
            detail: ["edibles/request", {}]
          })
        );
      }
    });
  }
}