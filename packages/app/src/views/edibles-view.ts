import { css, html, shadow } from "@unbndl/html";

export class EdiblesViewElement extends HTMLElement {
  static template = html`
    <template>
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

            <fg-edible-list src="/api/edibles"></fg-edible-list>
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
    </template>
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

    @media (max-width: 800px) {
      .page-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(EdiblesViewElement.template)
      .styles(EdiblesViewElement.styles);
  }
}