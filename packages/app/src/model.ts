// Local fallback for Edible type to avoid missing module errors.
// Replace or remove this when a proper server/models import is available.
export type Edible = any;

export interface Model {
  edibles?: Edible[];
}

export const init: Model = {};