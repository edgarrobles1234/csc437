import { Edible } from "server/models";

export interface Model {
  edibles?: Edible[];
}

export const init: Model = {};