import { FavoriteMovieRESP } from "../../favorite-setting/response/favorite-movie.response";
import { FavoriteSongRESP } from "../../favorite-setting/response/favorite-song.response";
import { MbtiResultRESP } from "../../personality-test/response/mbti-result.response";

export interface CallerInfoRESP {
    displayName: string;
    avatarUrl: string;
    personalInfo: {
        birthdate?: string;
        origin?: string;
        gender?: boolean;
        sex?: string;
        job?: string;
        workAt?: string;
        major?: string;
        height?: number;
        languages?: string[];
        hobbies?: string[];
        favoriteSongs?: FavoriteSongRESP[];
        // favoriteBooks?: string[];
        favoriteMovies?: FavoriteMovieRESP[];
    };
    mbtiResult?: MbtiResultRESP; 
}
