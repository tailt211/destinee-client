export interface FavoriteMovieRESP {
    id: number;
    title: string;
    originalTitle: string;
    backdropPath?: string | null;
    posterPath?: string | null;
    releaseDate?: string | null;
}

export interface FavoriteMoviesRESP {
    favoriteMovies: FavoriteMovieRESP[];
}