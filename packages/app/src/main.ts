import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { Store } from "@unbndl/store";
import { BrowserHistory, Switch } from "@unbndl/switch";

import { HeaderElement } from "./components/blz-header.ts";
import { EdibleCardElement } from "./components/edible-card.ts";
import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import { Cmd, update } from "./update.ts";
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
  "store-provider": class AppStore extends Store.Provider<Model, Msg, Cmd> {
    constructor() {
      super(update, init);
    }
  },
  "blz-header": HeaderElement,
  "edible-card": EdibleCardElement,
  "home-view": HomeViewElement,
  "edibles-view": EdiblesViewElement,
  "router-switch": (class AppSwitch extends (Switch.Element as any) {
    constructor() {
      super(routes);
    }
  } as unknown) as CustomElementConstructor
});