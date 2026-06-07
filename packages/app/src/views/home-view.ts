import { css, html, shadow } from "@unbndl/html";

export class HomeViewElement extends HTMLElement {
  static template = html`
    <template>
      <main class="page-shell">
        <div class="page-grid">
          <section class="content-stack">
            <section class="intro-panel">
              <h2>Site Pages</h2>
              <p>Choose a page below.</p>
            </section>

            <ul class="link-list">
              <li class="link-card">
                <a href="/app/edibles">Edible Plants and Mushrooms</a>
              </li>
            </ul>
          </section>

          <aside class="sidebar-stack">
            <section class="sidebar-card">
              <h3>Quick Tip</h3>
              <p>Always identify wild foods carefully before eating them.</p>
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

    .link-list {
      list-style: none;
      display: grid;
      gap: 14px;
      margin: 0;
      padding: 0;
    }

    .link-card a {
      display: block;
      padding: 18px 20px;
      border-radius: 14px;
      border: 1px solid #d7e4ce;
      background: #eef6e7;
      color: #355e3b;
      text-decoration: none;
      font-weight: 700;
    }

    .link-card a:hover {
      background: #e3f0d8;
      text-decoration: underline;
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
      .template(HomeViewElement.template)
      .styles(HomeViewElement.styles);
  }
}