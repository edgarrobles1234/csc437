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
        .then((doc) => doc ?? undefined)
        .catch((err) => {
        throw err;
    });
}
export default { index, get };
