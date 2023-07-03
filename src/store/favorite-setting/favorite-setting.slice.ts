import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchMoviesThunk,
    fetchSongsThunk,
    loadMoreMoviesThunk,
    loadMoreSongsThunk,
    updateFavoriteMoviesThunk,
    updateFavoriteSongsThunk,
} from './favorite-setting.thunk';
import { FavoriteMovieDTO } from '../../model/profile/dto/favorite-movie.dto';
import { FavoriteSongDTO } from '../../model/profile/dto/favorite-song.dto';
import { SongDTO } from '../../model/favorite-setting/dto/song.dto';
import { PendingAction, RejectedAction } from '../store-type';

export interface FavoriteSettingState {
    loading: boolean;
    isDataAvailable: boolean;
    currentPage: number;
    songs: SongDTO[];
    lastestFavoriteSongs: FavoriteSongDTO[];
    favoriteSongs: FavoriteSongDTO[];
    movies: FavoriteMovieDTO[];
    lastestFavoriteMovies: FavoriteMovieDTO[];
    favoriteMovies: FavoriteMovieDTO[];
    error?: string;
}

const initialState: FavoriteSettingState = {
    loading: false,
    isDataAvailable: false,
    currentPage: 1,
    songs: [],
    lastestFavoriteSongs: [],
    favoriteSongs: [],
    movies: [],
    lastestFavoriteMovies: [],
    favoriteMovies: [],
};

const favoriteSettingSlice = createSlice({
    name: 'favorite-setting',
    initialState: initialState,
    reducers: {
        setSongs: (state, action: PayloadAction<SongDTO[]>) => {
            state.songs = action.payload;
        },
        setFavoriteSongs: (state, action: PayloadAction<FavoriteSongDTO[]>) => {
            state.favoriteSongs = action.payload;
            state.lastestFavoriteSongs = action.payload;
        },
        addFavoriteSong: (state, action: PayloadAction<FavoriteSongDTO>) => {
            if (state.favoriteSongs.find(m => m.id === action.payload.id)) return;
            state.favoriteSongs.push(action.payload);
        },
        removeFavoriteSong: (state, action: PayloadAction<FavoriteSongDTO>) => {
            state.favoriteSongs = state.favoriteSongs.filter(
                (song) => song.id !== action.payload.id,
            );
        },
        setMovies: (state, action: PayloadAction<FavoriteMovieDTO[]>) => {
            state.movies = action.payload;
        },
        setFavoriteMovies: (state, action: PayloadAction<FavoriteMovieDTO[]>) => {
            state.favoriteMovies = action.payload;
            state.lastestFavoriteMovies = action.payload;
        },
        addFavoriteMovie: (state, action: PayloadAction<FavoriteMovieDTO>) => {
            if (state.favoriteMovies.find(m => m.id === action.payload.id)) return;
            state.favoriteMovies.push(action.payload);
        },
        removeFavoriteMovie: (state, action: PayloadAction<FavoriteMovieDTO>) => {
            state.favoriteMovies = state.favoriteMovies.filter(
                (movie) => movie.id !== action.payload.id,
            );
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchSongsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.songs = payload;
            state.currentPage = 1;
            if (payload.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreSongsThunk.fulfilled, (state, { payload }) => {
            state.songs = [...state.songs, ...payload.songs];
            state.currentPage = payload.page;
            if (payload.songs.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(fetchMoviesThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.movies = payload;
            state.currentPage = 1;
            if (payload.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreMoviesThunk.fulfilled, (state, { payload }) => {
            state.movies = [...state.movies, ...payload.movies];
            state.currentPage = payload.page;
            if (payload.movies.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(updateFavoriteSongsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.favoriteSongs = payload;
            state.lastestFavoriteSongs = payload;
        }),
        builder.addCase(updateFavoriteMoviesThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.favoriteMovies = payload;
            state.lastestFavoriteMovies = payload;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('favorite-setting/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('load-more'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('favorite-setting/') &&
                action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const {
    setFavoriteSongs,
    addFavoriteSong,
    removeFavoriteSong,
    setFavoriteMovies,
    addFavoriteMovie,
    removeFavoriteMovie,
    resetState,
} = favoriteSettingSlice.actions;

export default favoriteSettingSlice.reducer;
