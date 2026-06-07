import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { BrowserHistory, Switch } from "@unbndl/switch";

import { HeaderElement } from "./components/blz-header.ts";
import { EdibleCardElement } from "./components/edible-card.ts";
import { EdibleListElement } from "./components/edible-list.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { EdiblesViewElement } from "./views/edibles-view.ts";

const routes = [
  {
    path: "/app/edibles",
    view: html`<edibles-view></edibles-view>`
  },
  {
    path: "/app",
    view: html`<home-view></home-view>`
  },
  {
    path: "/app/",
    redirect: "/app"
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "auth-provider": Auth.Provider,
  "history-provider": BrowserHistory.Provider,
  "blz-header": HeaderElement,
  "fg-edible-card": EdibleCardElement,
  "fg-edible-list": EdibleListElement,
  "home-view": HomeViewElement,
  "edibles-view": EdiblesViewElement,
  // Cast to CustomElementConstructor to satisfy TS runtime element typing
  "router-switch": (class AppSwitch extends (Switch.Element as any) {
    constructor() {
      super(routes);
    }
  } as unknown) as CustomElementConstructor
});