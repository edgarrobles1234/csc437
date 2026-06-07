import { Auth } from "@unbndl/auth";
import { ThenUpdate } from "@unbndl/store";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";
import { Edible } from "server/models";

export type Cmd =
  | ["edibles/load", { edibles: Edible[] }];

export function update(
  model: Readonly<Model>,
  message: Msg | Cmd,
  auth: Auth.Model
): Model | ThenUpdate<Model, Cmd> {
  const [type, payload] = message;

  switch (type) {
    case "edibles/request":
      if (model.edibles) return model;
      return [model, requestEdibles(auth)];

    case "edibles/load":
      return { ...model, edibles: payload.edibles };

    default:
      throw new Error(`Unhandled message: ${type}`);
  }
}

function requestEdibles(auth: Auth.Model): Promise<Cmd> {
  return fetch("/api/edibles", {
    headers: Auth.headers(auth)
  })
    .then((response: Response) => {
      if (response.status !== 200) {
        throw new Error(`Edibles request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((json: unknown) => {
      const edibles = (json as { edibles?: Edible[] }).edibles ?? [];
      return ["edibles/load", { edibles }];
    });
}