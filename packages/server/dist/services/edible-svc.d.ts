import { Edible } from "../models/index.ts";
declare function get(id: string): Edible | undefined;
declare function getAll(): Edible[];
declare const _default: {
    get: typeof get;
    getAll: typeof getAll;
};
export default _default;
