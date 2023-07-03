export interface SongDTO {
    id: number;
    path: string;
    title: string;
    artist: string;
    thumbnailPath?: string | null;
    releaseDate?: string | null;
}