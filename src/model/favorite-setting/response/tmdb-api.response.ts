export type TMDBApiRESP = {
    page: number;
    total_pages: number;
    total_results: number;
    results: {
        id: number;
        title?: string;
        original_title?: string;
        original_language: string;
        overview: string;
        
        /* Thumbnail */
        backdrop_path: string | null;
        poster_path: string | null;
        
        /* Detail */
        video: boolean;
        genre_ids: number[];
        adult: boolean;
        media_type?: 'tv' | 'movie';
        
        /* Statistic */
        popularity: number;
        release_date?: string;
        vote_average: number;
        vote_count: number;

        /* TV Resp */
        name?: string;
        original_name?: string;
        first_air_date?: string;
        origin_country?: string[];
    }[];
};
