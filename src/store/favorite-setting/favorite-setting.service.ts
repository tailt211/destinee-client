import axios from 'axios';
import { isEmpty } from 'lodash';
import { destineeApi } from '../../https';
import { SongDTO } from '../../model/favorite-setting/dto/song.dto';
import { UpdateFavoriteMovieREQ } from '../../model/favorite-setting/request/favorite-movie.request';
import { UpdateFavoriteSongREQ } from '../../model/favorite-setting/request/favorite-song.request';
import { UpdateFavoriteSettingRESP } from '../../model/favorite-setting/response/favorite-setting.response';
import { GeniusApiRESP } from '../../model/favorite-setting/response/genius-api.response';
import { TMDBApiRESP } from '../../model/favorite-setting/response/tmdb-api.response';
import { FavoriteMovieDTO } from '../../model/profile/dto/favorite-movie.dto';
import { FavoriteSongDTO } from '../../model/profile/dto/favorite-song.dto';

export const fetchGeniusSongs = async (search: string, page: number = 1, limit: number = 15) => {
    if (!process.env.REACT_APP_GENIUS_URL || !process.env.REACT_APP_GENIUS_KEY)
        throw new Error("Can't call Genius API without credential");
    try {
        const res = await axios.get<GeniusApiRESP>(process.env.REACT_APP_GENIUS_URL, {
            params: {
                q: search,
                per_page: limit || process.env.REACT_APP_GENIUS_SONG_PER_PAGE || '10',
                page: `${page}`,
                access_token: process.env.REACT_APP_GENIUS_KEY,
            },
        });

        // const PATH_REGEX = /https:\/\/images\.genius\.com\/(?<path>\w+)\.300x300x1\.jpg/;
        const PATH_REGEX = /https:\/\/images\.genius\.com(?<path>[^ $]+)/;
        return {
            songs: res.data.response.hits.map((song) => {
                let releaseDate = null;
                if (song.result.release_date_components)
                    releaseDate = new Date(
                        Date.UTC(
                            song.result.release_date_components.year,
                            song.result.release_date_components.month,
                            song.result.release_date_components.day,
                        ),
                    ).toISOString();
    
                return {
                    id: song.result.id,
                    path: song.result.path,
                    title: song.result.title,
                    artist: song.result.artist_names,
                    releaseDate,
                    thumbnailPath: song.result.song_art_image_thumbnail_url ? PATH_REGEX.exec(song.result.song_art_image_thumbnail_url)
                    ?.groups?.path! : null,
                };
            }) as SongDTO[],
            page,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tìm kiếm bài hát');
    }
};

export const fetchMovies = async (search?: string, page: number = 1) => {
    if (!process.env.REACT_APP_MOVIE_URL || !process.env.REACT_APP_MOVIE_KEY)
        throw new Error("Can't call Movie API without credential");

    let url = process.env.REACT_APP_MOVIE_URL;
    url += isEmpty(search) ? '/movie/popular' : `/search/multi`;

    try {
        const res = await axios.get<TMDBApiRESP>(url, {
            params: {
                language: 'vi-VN',
                page,
                query: isEmpty(search) ? undefined : search?.trim(),
                include_adult: isEmpty(search) ? undefined : false,
            },
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_MOVIE_KEY}`,
            },
        });

        return {
            movies: res.data.results.map(
                (movie) =>
                    {
                        const title = !movie.media_type || movie.media_type === 'movie' ? movie.title : movie.name;
                        const originalTitle = !movie.media_type || movie.media_type === 'movie' ? movie.original_title : movie.original_name;
                        const releaseDate = !movie.media_type || movie.media_type === 'movie' ? movie.release_date : movie.first_air_date;
                        return {
                            id: movie.id,
                            title,
                            originalTitle,
                            backdropPath: movie.backdrop_path,
                            posterPath: movie.poster_path,
                            releaseDate: isEmpty(releaseDate)
                                ? null
                                : new Date(releaseDate!).toISOString(),
                        } as FavoriteMovieDTO;
                    }
            ),
            page,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tìm kiếm bộ phim');
    }
};

export const updateFavoriteSongs = async (id: string, body: UpdateFavoriteSongREQ) => {
    try {
        const data = (
            await destineeApi.patch<UpdateFavoriteSettingRESP>(
                `/profiles/${id}/favorite-song`,
                body,
            )
        ).data;

        return data.personalInfo.favoriteSongs!.map(
            (song) =>
                ({
                    id: song.id,
                    path: song.path,
                    title: song.title,
                    thumbnailPath: song.thumbnailPath,
                    artist: song.artist,
                    releaseDate: song.releaseDate,
                } as FavoriteSongDTO),
        );
    } catch (err) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi cập nhật bài hát');
    }
};

export const updateFavoriteMovies = async (id: string, body: UpdateFavoriteMovieREQ) => {
    try {
        const data = (
            await destineeApi.patch<UpdateFavoriteSettingRESP>(
                `/profiles/${id}/favorite-movie`,
                body,
            )
        ).data;

        return data.personalInfo.favoriteMovies!.map(
            (movie) =>
                ({
                    id: movie.id,
                    title: movie.title,
                    originalTitle: movie.originalTitle,
                    backdropPath: movie.backdropPath,
                    posterPath: movie.posterPath,
                    releaseDate: movie.releaseDate,
                } as FavoriteMovieDTO),
        );
    } catch (err) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi cập nhật bài hát');
    }
};
