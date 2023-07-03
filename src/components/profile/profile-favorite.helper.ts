import { FavoriteMovieDTO } from '../../model/profile/dto/favorite-movie.dto';
import { FavoriteSongDTO } from '../../model/profile/dto/favorite-song.dto';

export const favoriteSongsDisplayer = (songs: FavoriteSongDTO[] | undefined) => {
    if (!songs) return [];
    return songs.map((song) => ({
        thumbnail: `${process.env.REACT_APP_GENIUS_IMAGE_HOST}${song.thumbnailPath}`,
        name: song.title + '-' + song.artist,
    }));
};

export const favoriteMoviesDisplayer = (movies: FavoriteMovieDTO[] | undefined) => {
    if (!movies) return [];
    return movies.map((movie) => ({
        thumbnail: `${process.env.REACT_APP_MOVIE_IMAGE_HOST}/${process.env.REACT_APP_MOVIE_IMAGE_SIZE}${movie.posterPath}`,
        name: movie.originalTitle,
    }));
};
