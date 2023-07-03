import { FavoriteMovieRESP } from '../favorite-setting/response/favorite-movie.response';
import { FavoriteSongRESP } from '../favorite-setting/response/favorite-song.response';
import { MbtiResultRESP } from '../personality-test/response/mbti-result.response';

interface PersonalInfoRESP {
    birthdate: string;

    origin: string;

    gender: boolean;

    sex: string;

    job?: string;

    workAt?: string;

    major?: string;

    height?: number;

    languages?: string[];

    hobbies?: string[];

    favoriteSongs?: FavoriteSongRESP[];

    // favoriteBooks?: ProfileFavoriteResponse[];

    favoriteMovies?: FavoriteMovieRESP[];
}

interface ProfilePageSettingRESP {
    displayName: string;
    age: boolean;
    height: boolean;
    origin: boolean;
    jobStatus: boolean;
    languages: boolean;
    hobbies: boolean;
    sex: boolean;
    bio: string;
}

interface CallSettingRESP {
    displayName: string;
    age: boolean;
    height: boolean;
    origin: boolean;
    jobStatus: boolean;
    languages: boolean;
    hobbies: boolean;
    sex: boolean;
}

export interface ProfileRESP {
    _id: string;
    name: string;
    nickname: string;
    username: string;
    avatar?: {
        _id: string;
    };
    personalInfo: PersonalInfoRESP;
    profilePageSetting?: ProfilePageSettingRESP;
    callSetting?: CallSettingRESP;
    mbtiResult: MbtiResultRESP | null;
    disabled: boolean;
    callCountLeft: number;
}
