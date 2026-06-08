import { Auth } from "@unbndl/auth";
import { ThenUpdate } from "@unbndl/store";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";
import { Edible } from "server/models";

export type Cmd =
  | ["edibles/load", { edibles: Edible[] }]
  | ["edibles/fail", { message: string }]
  | ["edible/saved", { edible: Edible }];

type SaveCallbacks = {
  onSuccess?: () => void;
  onFailure?: (err: Error) => void;
};

export function update(
  model: Readonly<Model>,
  message: Msg | Cmd,
  auth: Auth.Model
): Model | ThenUpdate<Model, Cmd> {
  const type = message[0];

  switch (type) {
    case "edibles/request":
      if (model.edibles !== undefined) return model;
      return [model, requestEdibles(auth)];

    case "edibles/save": {
      const payload = message[1] as {
        edibleid: string;
        edible: Edible;
      };
      const callbacks = (message[2] ?? {}) as SaveCallbacks;

      return [
        model,
        saveEdible(payload, auth)
          .then((cmd): Cmd => {
            callbacks.onSuccess?.();
            return cmd;
          })
          .catch((err: unknown): Cmd => {
            const error =
              err instanceof Error ? err : new Error("Save failed");
            callbacks.onFailure?.(error);
            return ["edibles/fail", { message: error.message }];
          })
      ];
    }

    case "edibles/load": {
      const { edibles } = message[1];
      return { ...model, edibles };
    }

    case "edible/saved": {
      const { edible } = message[1];
      const edibleId = getEdibleId(edible);

      return {
        ...model,
        edibles: (model.edibles ?? []).map((item) =>
          getEdibleId(item) === edibleId ? edible : item
        )
      };
    }

    case "edibles/fail": {
      const { message: errorMessage } = message[1];
      console.error(errorMessage);

      return model.edibles === undefined
        ? { ...model, edibles: [] }
        : model;
    }

    default: {
      const unhandled: never = type;
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
}

function requestEdibles(auth: Auth.Model): Promise<Cmd> {
  return fetch("/api/edibles", {
    headers: Auth.headers(auth)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(`Edibles request failed: ${response.status}`);
    })
    .then((json: unknown): Cmd => {
      const edibles = normalizeEdibles(json);
      return ["edibles/load", { edibles }];
    })
    .catch((error: unknown): Cmd => {
      const message =
        error instanceof Error ? error.message : "Unknown edibles request error";
      return ["edibles/fail", { message }];
    });
}

function saveEdible(
  payload: { edibleid: string; edible: Edible },
  auth: Auth.Model
): Promise<Cmd> {
  return fetch(`/api/edibles/${payload.edibleid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(auth)
    },
    body: JSON.stringify(payload.edible)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(`Failed to save edible: ${response.status}`);
    })
    .then((json: unknown): Cmd => {
      const edible = normalizeEdible(json);
      return ["edible/saved", { edible }];
    })
    .catch((error: unknown) => {
      console.error("Error saving edible:", error);
      throw error;
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

function normalizeEdible(json: unknown): Edible {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    if ("edible" in json) {
      return (json as { edible: Edible }).edible;
    }

    return json as Edible;
  }

  throw new Error("No edible JSON in API response");
}

function getEdibleId(edible: any): string {
  return edible?.id ?? edible?._id ?? "";
}