interface MovieREQ {
    id: number;
    title: string;
    originalTitle: string;
    backdropPath?: string | null;
    posterPath?: string | null;
    releaseDate?: string | null;
}

export type UpdateFavoriteMovieREQ = {
    movies: MovieREQ[];
};
