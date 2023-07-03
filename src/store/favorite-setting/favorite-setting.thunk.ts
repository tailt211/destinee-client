import { createAsyncThunk } from '@reduxjs/toolkit';
import { MovieDTO } from '../../model/favorite-setting/dto/movie.dto';
import { SongDTO } from '../../model/favorite-setting/dto/song.dto';
import { UpdateFavoriteMovieREQ } from '../../model/favorite-setting/request/favorite-movie.request';
import { UpdateFavoriteSongREQ } from '../../model/favorite-setting/request/favorite-song.request';
import { FavoriteMovieDTO } from '../../model/profile/dto/favorite-movie.dto';
import { FavoriteSongDTO } from '../../model/profile/dto/favorite-song.dto';
import { updateProfilePersonalInfo } from '../profile/profile.slice';
import {
    fetchGeniusSongs,
    fetchMovies,
    updateFavoriteMovies,
    updateFavoriteSongs,
} from './favorite-setting.service';

export const fetchSongsThunk = createAsyncThunk<
    SongDTO[],
    string,
    { rejectValue: string }
>('favorite-setting/fetch-songs', async (search, { rejectWithValue }) => {
    try {
        return (await fetchGeniusSongs(search, 1)).songs;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const loadMoreSongsThunk = createAsyncThunk<
    { songs: SongDTO[], page: number },
    { search: string, page?: number },
    { rejectValue: string }
>('favorite-setting/load-more-songs', async ({ search, page }, { rejectWithValue }) => {
    try {
        return await fetchGeniusSongs(search, page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateFavoriteSongsThunk = createAsyncThunk<
    FavoriteSongDTO[],
    { profileId: string; body: UpdateFavoriteSongREQ },
    { rejectValue: string }
>(
    'favorite-setting/update-favorite-songs',
    async ({ profileId, body }, { rejectWithValue, dispatch }) => {
        try {
            const favoriteSongs = await updateFavoriteSongs(profileId, body);
            dispatch(
                updateProfilePersonalInfo({
                    favoriteSongs,
                }),
            );
            return favoriteSongs;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchMoviesThunk = createAsyncThunk<
    MovieDTO[],
    string | undefined,
    { rejectValue: string }
>('favorite-setting/fetch-movies', async (search, { rejectWithValue }) => {
    try {
        return await (await fetchMovies(search)).movies;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const loadMoreMoviesThunk = createAsyncThunk<
    { movies: MovieDTO[], page: number },
    { search: string, page?: number },
    { rejectValue: string }
>('favorite-setting/load-more-movies', async ({search, page}, { rejectWithValue }) => {
    try {
        return await fetchMovies(search, page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateFavoriteMoviesThunk = createAsyncThunk<
    FavoriteMovieDTO[],
    { profileId: string; body: UpdateFavoriteMovieREQ },
    { rejectValue: string }
>(
    'favorite-setting/update-favorite-movies',
    async ({ profileId, body }, { rejectWithValue, dispatch }) => {
        try {
            const favoriteMovies = await updateFavoriteMovies(profileId, body);
            dispatch(
                updateProfilePersonalInfo({
                    favoriteMovies,
                }),
            );
            return favoriteMovies;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
