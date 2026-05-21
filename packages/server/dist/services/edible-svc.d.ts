import { Edible } from "../models/index.ts";
declare function index(): Promise<Edible[]>;
declare function get(id: string): Promise<Edible | undefined>;
declare const _default: {
    index: typeof index;
    get: typeof get;
};
export default _default;
