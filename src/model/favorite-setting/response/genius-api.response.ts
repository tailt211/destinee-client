export type GeniusApiRESP = {
    response: {
        hits: {
            highlights: string[];
            index: string;
            type: string;
            result: {
                /* Description */
                id: number,
                url: string,
                api_path: string,
                path: string,
                title: string,
                title_with_featured: string,
                full_title: string,
                release_date_components: {
                    year: number,
                    month: number,
                    day: number,
                } | null,
                release_date_for_display: string | null,
                
                /* Thumbnail */
                song_art_image_thumbnail_url: string,
                song_art_image_url: string,
                header_image_thumbnail_url: string,
                header_image_url: string,

                /* Artist */
                artist_names: string,
                featured_artists: {
                    api_path: string,
                    header_image_url: string,
                    id: number,
                    image_url: string,
                    is_meme_verified: boolean,
                    is_verified: boolean,
                    name: string,
                    url: string,
                }[],
                primary_artist: {
                    api_path: string,
                    header_image_url: string,
                    id: number,
                    image_url: string,
                    is_meme_verified: boolean,
                    is_verified: boolean,
                    name: string,
                    url: string,
                    iq: number,
                }

                /* Statistic */
                annotation_count: number,
                lyrics_owner_id: number,
                lyrics_state: string,
                pyongs_count: number | null,
                relationships_index_url: string,
                stats: {
                    unreviewed_annotations: number,
                    hot: boolean,
                    pageviews: number
                },
            };
        }[];
    };
};
