import { FavoriteMovieDTO } from "./favorite-movie.dto";
import { FavoriteSongDTO } from "./favorite-song.dto";
import { GENDER, JOB, LANGUAGE, REGION, SEX } from "../profile.constant";

export type ProfileFavoriteDTO = {
    id: string;
    title: string;
    thumbnail: string;
};

export interface PersonalInfoDTO {
    birthdate: string;

    origin: REGION;

    gender: GENDER;

    sex: SEX;

    job?: JOB;

    workAt?: string;

    major?: string;

    height?: number;

    languages?: LANGUAGE[];

    hobbies?: string[];

    favoriteSongs?: FavoriteSongDTO[];

    favoriteBooks?: ProfileFavoriteDTO[];

    favoriteMovies?: FavoriteMovieDTO[];
}