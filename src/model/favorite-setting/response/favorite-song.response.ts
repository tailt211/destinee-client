export interface FavoriteSongRESP {
    id: number;
    path: string;
    title: string;
    artist: string;
    thumbnailPath?: string | null;
    releaseDate?: string | null;
}

export interface FavoriteSongsRESP {
    favoriteSongs: FavoriteSongRESP[];
}