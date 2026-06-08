import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore } from "@unbndl/store";
import { Edible } from "server/models";
import { Model } from "../model.ts";

type EdibleMode = "view" | "edit";

type EdiblesViewModel = {
  edibles?: Model["edibles"];
  mode: EdibleMode;
  selectedId?: string;
};

function getEdibleId(edible: any): string {
  return edible?.id ?? edible?._id ?? "";
}

function edibleName(edible: any) {
  return edible.name ?? edible.title ?? "Untitled";
}

function renderEdibleCard(edible: any) {
  const edibleId = getEdibleId(edible);

  return html`
    <article class="editable-card">
      <edible-card
        id=${edibleId}
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

      <div class="card-actions">
        <button
          type="button"
          class="edit-button"
          data-action="edit"
          data-edibleid=${edibleId}
        >
          Edit
        </button>
      </div>
    </article>
  `;
}

function renderEditForm(edible: any) {
  const edibleId = getEdibleId(edible);

  return html`
    <article class="edit-panel">
      <h3>Edit ${edibleName(edible)}</h3>

      <form data-edibleid=${edibleId}>
        <label class="form-field">
          <span>Name</span>
          <input name="name" value=${edible.name ?? ""} />
        </label>

        <label class="form-field">
          <span>Title</span>
          <input name="title" value=${edible.title ?? ""} />
        </label>

        <label class="form-field">
          <span>Type</span>
          <input name="type" value=${edible.type ?? ""} />
        </label>

        <label class="form-field">
          <span>Season</span>
          <input name="season" value=${edible.season ?? ""} />
        </label>

        <label class="form-field">
          <span>Scientific Name</span>
          <input name="scientificName" value=${edible.scientificName ?? ""} />
        </label>

        <label class="form-field">
          <span>Found In</span>
          <input name="foundIn" value=${edible.foundIn ?? ""} />
        </label>

        <label class="form-field">
          <span>Safe To Eat</span>
          <input name="safeToEat" value=${edible.safeToEat ?? ""} />
        </label>

        <label class="form-field">
          <span>Icon</span>
          <input name="icon" value=${edible.icon ?? ""} />
        </label>

        <label class="form-field">
          <span>Wiki Link</span>
          <input name="wikiHref" value=${edible.wikiHref ?? ""} />
        </label>

        <label class="form-field">
          <span>Harvest Notes</span>
          <textarea name="harvestNotes">${edible.harvestNotes ?? ""}</textarea>
        </label>

        <label class="form-field">
          <span>Sustainability Notes</span>
          <textarea name="sustainabilityNotes">${edible.sustainabilityNotes ?? ""}</textarea>
        </label>

        <div class="form-actions">
          <button type="submit">Save</button>
          <button
            type="button"
            class="cancel-button"
            data-action="cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </article>
  `;
}

export class EdiblesViewElement extends HTMLElement {
  viewModel = createViewModel<EdiblesViewModel>({
    mode: "view",
    selectedId: undefined
  }).with(fromStore<Model>(this), "edibles");

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
                        ${$.edibles.map((edible: any) => {
                          const edibleId = getEdibleId(edible);
                          const isEditing =
                            $.mode === "edit" && $.selectedId === edibleId;

                          return isEditing
                            ? renderEditForm(edible)
                            : renderEdibleCard(edible);
                        })}
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
    .sidebar-card,
    .edit-panel {
      background: #f7fbf2;
      border: 1px solid #d7e4ce;
      border-radius: 14px;
      padding: 20px;
    }

    .intro-panel h2,
    .sidebar-card h3,
    .edit-panel h3 {
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

    .editable-card {
      display: grid;
      gap: 12px;
    }

    .card-actions,
    .form-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    form {
      display: grid;
      gap: 16px;
    }

    .form-field {
      display: grid;
      gap: 8px;
    }

    input,
    textarea,
    button {
      font: inherit;
    }

    input,
    textarea {
      padding: 10px 12px;
      border: 1px solid #c9d7bf;
      border-radius: 10px;
      background: #fff;
    }

    textarea {
      min-height: 96px;
      resize: vertical;
    }

    button {
      padding: 10px 14px;
      border: 0;
      border-radius: 999px;
      background-color: var(--cream-green);
      color: var(--text-dark);
      font-weight: 700;
      cursor: pointer;
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
      .replace(this.viewModel.render(this.view))
      .listen({
        click: (ev: Event) => this.handleClick(ev),
        submit: (ev: Event) => this.submitForm(ev)
      });
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

  handleClick(ev: Event) {
    const target = ev.target as HTMLElement | null;
    if (!target) return;

    const editButton = target.closest("[data-action='edit']") as HTMLElement | null;
    if (editButton) {
      const edibleid = editButton.dataset.edibleid;
      if (edibleid) {
        this.viewModel.set("mode", "edit");
        this.viewModel.set("selectedId", edibleid);
      }
      return;
    }

    const cancelButton = target.closest("[data-action='cancel']") as HTMLElement | null;
    if (cancelButton) {
      this.viewModel.set("mode", "view");
      this.viewModel.set("selectedId", undefined);
    }
  }

  submitForm(ev: Event) {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const edibleid = form.dataset.edibleid;

    if (!edibleid) return;

    const json = this.formDataToJSON(form);

    this.dispatchEvent(
      new CustomEvent("store:message", {
        bubbles: true,
        composed: true,
        detail: [
          "edibles/save",
          {
            edibleid,
            edible: json as Edible
          },
          {
            onSuccess: () => {
              this.viewModel.set("mode", "view");
              this.viewModel.set("selectedId", undefined);
            },
            onFailure: (error: Error) => {
              console.error("Save failed:", error);
            }
          }
        ]
      })
    );
  }

  formDataToJSON(form: HTMLFormElement): object {
    const inputs = Array.from(form.elements).filter(
      (el) => "name" in el
    ) as Array<HTMLInputElement | HTMLTextAreaElement>;

    const entries = inputs
      .filter((el) => el.name)
      .map((el) => [el.name, el.value]);

    return Object.fromEntries(entries);
  }
}