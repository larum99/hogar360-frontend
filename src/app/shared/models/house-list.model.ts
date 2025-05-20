import { Category } from './category.model';
import { LocationSearch } from './location-search.model';

export interface HouseList {
    id: number;
    name: string;
    description: string;
    category: Category;
    bedrooms: number;
    bathrooms: number;
    price: number;
    location: LocationSearch;
    publicationDate: string;
    activePublicationDate: string;
    status: string; //'PUBLISHED'
    publisherId: number;
}
