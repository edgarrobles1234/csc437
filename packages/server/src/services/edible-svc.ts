import { Schema, model } from "mongoose";
import { Edible } from "../models/index.ts";

const edibleSchema = new Schema<Edible>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    icon: {
      type: String,
      enum: ["mushroom", "berry", "leaf"],
      required: true
    },
    wikiHref: String,
    type: String,
    season: String,
    scientificName: String,
    foundIn: String,
    safeToEat: String,
    harvestNotes: String,
    sustainabilityNotes: String,
    links: [
      {
        label: String,
        href: String
      }
    ]
  },
  { collection: "fg_edibles" }
);

const EdibleModel = model<Edible>("Edible", edibleSchema);

function index(): Promise<Edible[]> {
  return EdibleModel.find();
}

function get(id: string): Promise<Edible | undefined> {
  return EdibleModel.findOne({ id })
    .then((doc) => doc ?? undefined);
}

function create(json: Edible): Promise<Edible> {
  const edible = new EdibleModel(json);
  return edible.save();
}

function update(
  id: string,
  edible: Edible
): Promise<Edible | undefined> {
  return EdibleModel.findOneAndUpdate(
    { id },
    edible,
    { new: true }
  ).then((updated) => {
    if (!updated) throw new Error(`${id} not updated`);
    return updated as Edible;
  });
}

function remove(id: string): Promise<void> {
  return EdibleModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw new Error(`${id} not deleted`);
  });
}

export default { index, get, create, update, remove };