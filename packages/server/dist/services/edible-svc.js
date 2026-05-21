import { Schema, model } from "mongoose";
const edibleSchema = new Schema({
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
}, { collection: "fg_edibles" });
const EdibleModel = model("Edible", edibleSchema);
function index() {
    return EdibleModel.find();
}
function get(id) {
    return EdibleModel.findOne({ id })
        .then((doc) => doc ?? undefined);
}
function create(json) {
    const edible = new EdibleModel(json);
    return edible.save();
}
function update(id, edible) {
    return EdibleModel.findOneAndUpdate({ id }, edible, { new: true }).then((updated) => {
        if (!updated)
            throw new Error(`${id} not updated`);
        return updated;
    });
}
function remove(id) {
    return EdibleModel.findOneAndDelete({ id }).then((deleted) => {
        if (!deleted)
            throw new Error(`${id} not deleted`);
    });
}
export default { index, get, create, update, remove };
