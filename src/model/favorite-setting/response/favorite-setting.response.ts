import { FavoriteMoviesRESP } from "./favorite-movie.response";
import { FavoriteSongsRESP } from "./favorite-song.response"

export interface UpdateFavoriteSettingRESP {
    personalInfo: Partial<FavoriteSongsRESP & FavoriteMoviesRESP>;
}