import { Auth } from "@unbndl/auth";
import { ThenUpdate } from "@unbndl/store";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";
import { Edible } from "server/models";

export type Cmd =
  | ["edibles/load", { edibles: Edible[] }]
  | ["edibles/fail", { message: string }];

export function update(
  model: Readonly<Model>,
  message: Msg | Cmd,
  auth: Auth.Model
): Model | ThenUpdate<Model, Cmd> {
  const [type, payload] = message;
  console.log("store update:", type, payload);

  switch (type) {
    case "edibles/request":
      if (model.edibles !== undefined) return model;
      return [model, requestEdibles(auth)];

    case "edibles/load":
      console.log("store loaded edibles:", payload.edibles);
      return { ...model, edibles: payload.edibles };

    case "edibles/fail":
      console.error("store failed edibles:", payload.message);
      return { ...model, edibles: [] };

    default:
      throw new Error(`Unhandled message: ${type}`);
  }
}

function requestEdibles(auth: Auth.Model): Promise<Cmd> {
  console.log("requestEdibles auth:", auth);

  return fetch("/api/edibles", {
    headers: Auth.headers(auth)
  })
    .then((response: Response) => {
      console.log("requestEdibles status:", response.status);

      if (response.status !== 200) {
        throw new Error(`Edibles request failed: ${response.status}`);
      }

      return response.json();
    })
    .then((json: unknown): Cmd => {
      console.log("requestEdibles json:", json);

      const edibles = normalizeEdibles(json);
      return ["edibles/load", { edibles }] as Cmd;
    })
    .catch((error: unknown): Cmd => {
      const message =
        error instanceof Error ? error.message : "Unknown edibles request error";
      return ["edibles/fail", { message }];
    });
}

function normalizeEdibles(json: unknown): Edible[] {
  if (Array.isArray(json)) {
    return json as Edible[];
  }

  if (json && typeof json === "object" && "edibles" in json) {
    const maybeEdibles = (json as { edibles?: unknown }).edibles;
    if (Array.isArray(maybeEdibles)) {
      return maybeEdibles as Edible[];
    }
  }

  return [];
}