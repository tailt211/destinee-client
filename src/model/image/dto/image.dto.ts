import { TYPE_IMAGE } from "../type-image.enum";

export interface ImageType {
    name: string;
    type: TYPE_IMAGE;
    url?: string;
}

export interface ImageDTO {
    _id: string;
    name: string;
    size: number;
    type: TYPE_IMAGE;
    url?: string;
    types?: ImageType[];
    ownerId: string;
}