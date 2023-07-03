export interface ImageRESP {
    _id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    types: {
        name: string;
        type: string;
        url: string;
    }[];
    owner: string;
}
