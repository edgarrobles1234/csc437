import { Edible } from "../models/index.ts";
declare function index(): Promise<Edible[]>;
declare function get(id: string): Promise<Edible | undefined>;
declare function create(json: Edible): Promise<Edible>;
declare function update(id: string, edible: Edible): Promise<Edible | undefined>;
declare function remove(id: string): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
