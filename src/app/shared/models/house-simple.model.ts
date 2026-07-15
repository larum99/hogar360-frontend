import { LocationSearch } from "./location-search.model";

export interface HouseSimple {
    id: number;
    name: string;
    location?: LocationSearch;
}
