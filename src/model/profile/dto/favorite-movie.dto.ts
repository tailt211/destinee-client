export interface FavoriteMovieDTO {
    id: number;
    title: string;
    originalTitle: string;
    backdropPath?: string | null;
    posterPath?: string | null;
    releaseDate?: string | null;
}
