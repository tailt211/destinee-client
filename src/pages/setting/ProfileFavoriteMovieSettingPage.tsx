import {
    IonContent,
    IonHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonPage,
    IonSpinner,
    useIonToast,
} from '@ionic/react';
import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { use100vh } from 'react-div-100vh';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt, useHistory } from 'react-router';
import destineeLogo from '../../assets/destinee-logo.png';
import PageContentCmp from '../../components/container/PageContentCmp';
import FavoriteActionButtonsCmp from '../../components/favorite-setting/FavoriteActionButtonsCmp';
import FavoriteItemCmp from '../../components/favorite-setting/FavoriteItemCmp';
import FavoriteModalCmp from '../../components/favorite-setting/FavoriteModalCmp';
import FavoriteSearchToolbarCmp from '../../components/favorite-setting/FavoriteSearchToolbarCmp';
import { FavoriteMovieDTO } from '../../model/profile/dto/favorite-movie.dto';
import { AppDispatch, RootState } from '../../store';
import {
    addFavoriteMovie,
    FavoriteSettingState,
    removeFavoriteMovie,
    resetState as resetFavoriteSettingState,
    setFavoriteMovies,
} from '../../store/favorite-setting/favorite-setting.slice';
import {
    fetchMoviesThunk,
    loadMoreMoviesThunk,
    updateFavoriteMoviesThunk,
} from '../../store/favorite-setting/favorite-setting.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import { getToast } from '../../utils/toast.helper';
import styles from './ProfileFavoriteSongSettingPage.module.scss';

const ProfileFavoriteMovieSettingPage: FC = function (props) {
    const MODAL_ID = 'movie-modal';
    const [present, dismiss] = useIonToast();
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const favoriteMovieLimit = parseInt(process.env.REACT_APP_FAVORITE_MOVIE_LIMIT!) || 3;

    const movieToaster = getToast('Bộ phim yêu thích', dismiss, 2000);
    /* Element */
    const page = useRef(null);
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    const height = use100vh();

    /* State */
    const [lastSearch, setLastSearch] = useState('');
    const { movies, favoriteMovies, lastestFavoriteMovies, loading, isDataAvailable, currentPage } = useSelector(
        (state: RootState) => state.favoriteSetting,
    ) as FavoriteSettingState;

    const { _id, personalInfo } = useSelector((state: RootState) => state.profile) as ProfileState;
    const [isBlocking, setIsBlocking] = useState<boolean>(false);

    /* Effect */
    useEffect(() => {
        dispatch(fetchMoviesThunk());
    }, [dispatch]);

    useEffect(() => {
        setPresentingElement(page.current);
        dispatch(setFavoriteMovies(personalInfo.favoriteMovies || []));
    }, [dispatch, personalInfo.favoriteMovies]);

    useEffect(() => {
        return () => {
            dispatch(resetFavoriteSettingState());
        };
    }, [dispatch]);

    useEffect(() => {
        setIsBlocking(false);
        if (lastestFavoriteMovies.length === 0 && favoriteMovies.length === favoriteMovieLimit) setIsBlocking(true);
        if (lastestFavoriteMovies.length !== 0 && favoriteMovies.length === favoriteMovieLimit) {
            const isDiff = lastestFavoriteMovies.reduce(
                (prev, cur) => (favoriteMovies.some((fm) => fm.id === cur.id) === false ? true : prev),
                false,
            );
            if (isDiff) setIsBlocking(true);
        }
    }, [lastestFavoriteMovies, favoriteMovies, favoriteMovieLimit]);
    
    /* Handler */
    const movieSelectHandler = (movie: FavoriteMovieDTO) => {
        const isExisted = favoriteMovies.find((favMovie) => favMovie.id === movie.id);
        if (isExisted) {
            dispatch(removeFavoriteMovie(movie));
            return;
        }
        const MAX = 3;
        if (favoriteMovies.length >= MAX) {
            dispatch(addFavoriteMovie(movie));
            dispatch(removeFavoriteMovie(movie));
            // Chỗ này để cho movieIds refresh lại rồi trigger thằng checkbox khỏi check lỗi (no other best way)
            // Thằng này sẽ trigger removeFavoriteMovie 2 lần ở trên & dưới
            present(movieToaster(`Đã chọn tối đa ${MAX} bộ phim`, 'fail'));
            return;
        }
        dispatch(addFavoriteMovie(movie));
    };

    const searchHandler = (search: string) => {
        setLastSearch(search);
        dispatch(fetchMoviesThunk(search));
    };

    const saveHandler = async () => {
        const MIN = 3;
        if (favoriteMovies.length < MIN) {
            present(movieToaster(`Hãy chọn tối thiểu ${MIN} bộ phim`, 'fail'));
            return;
        }

        const lastestMovieIds = lastestFavoriteMovies.map((s) => s.id);
        if (favoriteMovies.every((movie) => lastestMovieIds.includes(movie.id))) {
            present(movieToaster('Đã cập nhật thành công', 'success'));
            history.goBack();
            return;
        }

        dispatch(
            updateFavoriteMoviesThunk({
                profileId: _id,
                body: { movies: favoriteMovies },
            }),
        ).then(() => {
            setIsBlocking(false);
            present(movieToaster('Đã cập nhật thành công', 'success'));
            history.goBack();
        });
    };

    const loadMoreData = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreMoviesThunk({ search: lastSearch, page: currentPage + 1 })).then(() => e.target.complete());
    };

    return (
        <IonPage className="grey__bg" ref={page}>
            <IonHeader>
                <FavoriteSearchToolbarCmp
                    debounce={1500}
                    isDisabled={loading}
                    searchHandler={searchHandler}
                    searchPlaceholder="Tìm kiếm tên bộ phim/diễn viên"
                    title="Bộ phim yêu thích nhất"
                />
            </IonHeader>
            <PageContentCmp customStyle={{ height: height! - 123, paddingTop: 0 }}>
                <div className={styles.container}>
                    <Prompt when={isBlocking} message={'Bạn chưa lưu thay đổi, bạn có muốn rời đi ?'} />
                    <div className={styles.contentContainer}>
                        {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                        {!loading && movies.length <= 0 && (
                            <div className={styles.emptyList}>
                                <h2>Không có kết quả phù hợp với từ khoá tìm kiếm</h2>
                            </div>
                        )}
                        {!loading && movies.length > 0 && (
                            <IonContent className={classNames([styles.content, 'no-scroll-bar'])}>
                                <IonList className={styles.list} lines="inset">
                                    {movies.map((movie) => (
                                        <FavoriteItemCmp
                                            key={movie.id}
                                            title={movie.title}
                                            description={
                                                movie.releaseDate
                                                    ? new Date(movie.releaseDate).getFullYear().toString()
                                                    : 'không rõ'
                                            }
                                            thumbnail={
                                                movie.posterPath
                                                    ? `${process.env.REACT_APP_MOVIE_IMAGE_HOST}/${process.env.REACT_APP_MOVIE_IMAGE_SIZE}${movie.posterPath}`
                                                    : destineeLogo
                                            }
                                            thumbnailAlt="movie-thumbnail"
                                            isChecked={!!favoriteMovies.find((favMovie) => favMovie.id === movie.id)}
                                            checkHandler={movieSelectHandler.bind(null, movie)}
                                        />
                                    ))}
                                </IonList>
                                <IonInfiniteScroll onIonInfinite={loadMoreData} threshold="100px" disabled={!isDataAvailable}>
                                    <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Đang tải thêm bộ phim..." />
                                </IonInfiniteScroll>
                            </IonContent>
                        )}
                    </div>
                    <FavoriteActionButtonsCmp
                        numberOfSelected={favoriteMovies.length}
                        objectTitle="bộ phim"
                        openModalId={MODAL_ID}
                        saveHandler={saveHandler}
                    />
                </div>

                <FavoriteModalCmp
                    modalTriggerId={MODAL_ID}
                    numberOfSelected={favoriteMovies.length}
                    presentingElement={presentingElement}>
                    <IonList lines="inset" className={styles.list}>
                        {favoriteMovies.map((movie) => (
                            <FavoriteItemCmp
                                key={movie.id}
                                title={movie.title}
                                description={
                                    movie.releaseDate ? new Date(movie.releaseDate).getFullYear().toString() : 'không rõ'
                                }
                                thumbnail={
                                    movie.posterPath
                                        ? `${process.env.REACT_APP_MOVIE_IMAGE_HOST}/${process.env.REACT_APP_MOVIE_IMAGE_SIZE}${movie.posterPath}`
                                        : destineeLogo
                                }
                                thumbnailAlt="movie-thumbnail"
                                isChecked={!!favoriteMovies.find((favMovie) => favMovie.id === movie.id)}
                                checkHandler={movieSelectHandler.bind(null, movie)}
                                isModalItem={true}
                            />
                        ))}
                    </IonList>
                </FavoriteModalCmp>
            </PageContentCmp>
        </IonPage>
    );
};

export default ProfileFavoriteMovieSettingPage;
