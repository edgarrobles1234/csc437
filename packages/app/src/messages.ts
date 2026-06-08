import { Edible } from "server/models";

export type Msg =
  | ["edibles/request", {}]
  | [
      "edibles/save",
      {
        edibleid: string;
        edible: Edible;
      },
      {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];