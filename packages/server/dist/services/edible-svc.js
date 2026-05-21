const edibles = {
    morel: {
        id: "morel",
        title: "Morel Mushroom",
        icon: "mushroom",
        wikiHref: "https://en.wikipedia.org/wiki/Morchella",
        type: "Mushroom",
        season: "Spring",
        scientificName: "Morchella",
        foundIn: "Forested areas, especially near hardwood trees",
        safeToEat: "Yes, if correctly identified and cooked",
        harvestNotes: "Cut carefully at the base and avoid damaging nearby growth.",
        sustainabilityNotes: "Only take what you need and leave smaller mushrooms behind.",
        links: [
            { label: "Locations", href: "locations.html" },
            { label: "Seasons", href: "seasons.html" },
            { label: "Safety", href: "safety.html" },
            { label: "Techniques", href: "techniques.html" }
        ]
    },
    chanterelle: {
        id: "chanterelle",
        title: "Chanterelle",
        icon: "mushroom",
        wikiHref: "https://en.wikipedia.org/wiki/Chanterelle",
        type: "Mushroom",
        season: "Summer to Fall",
        scientificName: "Cantharellus",
        foundIn: "Forested areas, especially mossy conifer and mixed forests",
        safeToEat: "Yes, if correctly identified",
        harvestNotes: "Cut or gently twist at the base and brush off dirt in the field.",
        sustainabilityNotes: "Harvest lightly and avoid disturbing the surrounding forest floor.",
        links: [
            { label: "Locations", href: "locations.html" },
            { label: "Seasons", href: "seasons.html" },
            { label: "Safety", href: "safety.html" },
            { label: "Techniques", href: "techniques.html" }
        ]
    },
    blackberry: {
        id: "blackberry",
        title: "Wild Blackberry",
        icon: "berry",
        wikiHref: "https://en.wikipedia.org/wiki/Rubus_fruticosus",
        type: "Berry",
        season: "Summer",
        scientificName: "Rubus fruticosus",
        foundIn: "Trails, roadsides, field edges, and open wooded areas",
        safeToEat: "Yes, if collected away from polluted areas",
        harvestNotes: "Pick ripe berries by hand and avoid damaging the plant.",
        sustainabilityNotes: "Leave some berries for wildlife and future regrowth.",
        links: [
            { label: "Locations", href: "locations.html" },
            { label: "Seasons", href: "seasons.html" },
            { label: "Safety", href: "safety.html" },
            { label: "Sustainability", href: "sustainability.html" }
        ]
    },
    minerslettuce: {
        id: "minerslettuce",
        title: "Miner's Lettuce",
        icon: "leaf",
        wikiHref: "https://en.wikipedia.org/wiki/Claytonia_perfoliata",
        type: "Leafy Green",
        season: "Spring",
        scientificName: "Claytonia perfoliata",
        foundIn: "Shady, moist areas in California",
        safeToEat: "Yes, when properly identified",
        harvestNotes: "Pick leaves gently and avoid uprooting the whole plant.",
        sustainabilityNotes: "Harvest lightly so plants can continue growing.",
        links: [
            { label: "Locations", href: "locations.html" },
            { label: "Seasons", href: "seasons.html" },
            { label: "Safety", href: "safety.html" },
            { label: "Sustainability", href: "sustainability.html" }
        ]
    }
};
function get(id) {
    return edibles[id];
}
function getAll() {
    return Object.values(edibles);
}
export default { get, getAll };
