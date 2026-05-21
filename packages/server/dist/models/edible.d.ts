export interface EdibleLink {
    label: string;
    href: string;
}
export type EdibleIcon = "mushroom" | "berry" | "leaf";
export interface Edible {
    id: string;
    title: string;
    icon: EdibleIcon;
    wikiHref: string;
    type: string;
    season: string;
    scientificName: string;
    foundIn: string;
    safeToEat: string;
    harvestNotes: string;
    sustainabilityNotes: string;
    links: EdibleLink[];
}
