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
import { isEmpty } from 'lodash';
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
import { FavoriteSongDTO } from '../../model/profile/dto/favorite-song.dto';
import { AppDispatch, RootState } from '../../store';
import {
    addFavoriteSong,
    FavoriteSettingState,
    removeFavoriteSong,
    resetState as resetFavoriteSettingState,
    setFavoriteSongs,
} from '../../store/favorite-setting/favorite-setting.slice';
import {
    fetchSongsThunk,
    loadMoreSongsThunk,
    updateFavoriteSongsThunk,
} from '../../store/favorite-setting/favorite-setting.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import { getToast } from '../../utils/toast.helper';
import styles from './ProfileFavoriteSongSettingPage.module.scss';

const ProfileFavoriteSongSettingPage: FC = function (props) {
    const MODAL_ID = 'song-modal';
    const [present, dismiss] = useIonToast();
    const dispatch: AppDispatch = useDispatch();
    const [lastSearch, setLastSearch] = useState('');
    const history = useHistory();
    const favoriteSongLimit = parseInt(process.env.REACT_APP_FAVORITE_SONG_LIMIT!) || 3;

    const songToaster = getToast('Bài hát yêu thích', dismiss, 2000);
    /* Element */
    const page = useRef(null);
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    const height = use100vh();

    /* State */
    const { songs, lastestFavoriteSongs, favoriteSongs, loading, isDataAvailable, currentPage } = useSelector(
        (state: RootState) => state.favoriteSetting,
    ) as FavoriteSettingState;
    const { _id, personalInfo } = useSelector((state: RootState) => state.profile) as ProfileState;
    const [isBlocking, setIsBlocking] = useState<boolean>(false);

    /* Effect */
    useEffect(() => {
        setLastSearch(process.env.REACT_APP_DEFAULT_SONG_SEARCH || 'son tung');
        dispatch(fetchSongsThunk(process.env.REACT_APP_DEFAULT_SONG_SEARCH || 'son tung'));
    }, [dispatch]);

    useEffect(() => {
        setPresentingElement(page.current);
        dispatch(setFavoriteSongs(personalInfo.favoriteSongs || []));
    }, [dispatch, personalInfo.favoriteSongs]);

    useEffect(() => {
        return () => {
            dispatch(resetFavoriteSettingState());
        };
    }, [dispatch]);

    useEffect(() => {
        setIsBlocking(false);
        if (lastestFavoriteSongs.length === 0 && favoriteSongs.length === favoriteSongLimit) setIsBlocking(true);
        if (lastestFavoriteSongs.length !== 0 && favoriteSongs.length === favoriteSongLimit) {
            const isDiff = lastestFavoriteSongs.reduce((prev, cur) => 
                favoriteSongs.some(fs => fs.id === cur.id) === false ? true : prev, false);
            if(isDiff) setIsBlocking(true)
        }
    }, [lastestFavoriteSongs, favoriteSongs, favoriteSongLimit]);

    /* Handler */
    const songSelectHandler = (song: FavoriteSongDTO) => {
        const isExisted = favoriteSongs.find((favSong) => favSong.id === song.id);
        if (isExisted) {
            dispatch(removeFavoriteSong(song));
            return;
        }

        const MAX = 3;
        if (favoriteSongs.length >= MAX) {
            dispatch(addFavoriteSong(song));
            dispatch(removeFavoriteSong(song));
            // Chỗ này để cho songIds refresh lại rồi trigger thằng checkbox khỏi check lỗi (no other best way)
            present(songToaster(`Đã chọn tối đa ${MAX} bài hát`, 'fail'));
            return;
        }
        dispatch(addFavoriteSong(song));
    };

    const searchHandler = (search: string) => {
        const mySearch = isEmpty(search) ? process.env.REACT_APP_DEFAULT_SONG_SEARCH || 'son tung' : search.trim();
        setLastSearch(mySearch);
        dispatch(fetchSongsThunk(mySearch));
    };

    const saveHandler = async () => {
        const MIN = 3;
        if (favoriteSongs.length < MIN) {
            present(songToaster(`Hãy chọn tối thiểu ${MIN} bài hát`, 'fail'));
            return;
        }

        const lastestSongIds = lastestFavoriteSongs.map((s) => s.id);
        if (favoriteSongs.every((song) => lastestSongIds.includes(song.id))) {
            present(songToaster('Đã cập nhật thành công', 'success'));
            history.goBack();
            return;
        }

        dispatch(updateFavoriteSongsThunk({ profileId: _id, body: { songs: favoriteSongs } })).then(() => {
            setIsBlocking(false);
            present(songToaster('Đã cập nhật thành công', 'success'));
            history.goBack();
        });
    };

    const loadMoreData = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreSongsThunk({ search: lastSearch, page: currentPage + 1 })).then(() => e.target.complete());
    };

    return (
        <IonPage className="grey__bg" ref={page}>
            <IonHeader>
                <FavoriteSearchToolbarCmp
                    debounce={1500}
                    isDisabled={loading}
                    searchHandler={searchHandler}
                    searchPlaceholder="Tìm kiếm tên bài hát / nghệ sĩ"
                    title="Bài hát yêu thích nhất"
                />
            </IonHeader>
            <PageContentCmp customStyle={{ height: height! - 123, paddingTop: 0 }}>
                <div className={styles.container}>
                    <Prompt when={isBlocking} message={'Bạn chưa lưu thay đổi, bạn có muốn rời đi ?'} />

                    <div className={styles.contentContainer}>
                        {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                        {!loading && songs.length <= 0 && (
                            <div className={styles.emptyList}>
                                <h2>Không có kết quả phù hợp với từ khoá tìm kiếm</h2>
                            </div>
                        )}
                        {!loading && songs.length > 0 && (
                            <IonContent className={classNames([styles.content, 'no-scroll-bar'])}>
                                <IonList className={styles.list} lines="inset">
                                    {songs.map((song) => (
                                        <FavoriteItemCmp
                                            key={song.id}
                                            title={song.title}
                                            description={song.artist}
                                            thumbnail={
                                                song.thumbnailPath
                                                    ? `${process.env.REACT_APP_GENIUS_IMAGE_HOST}${song.thumbnailPath}`
                                                    : destineeLogo
                                            }
                                            thumbnailAlt="song-thumbnail"
                                            isChecked={!!favoriteSongs.find((favSong) => favSong.id === song.id)}
                                            checkHandler={songSelectHandler.bind(null, song)}
                                        />
                                    ))}
                                </IonList>
                                <IonInfiniteScroll onIonInfinite={loadMoreData} threshold="100px" disabled={!isDataAvailable}>
                                    <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Đang tải thêm bài hát..." />
                                </IonInfiniteScroll>
                            </IonContent>
                        )}
                    </div>
                    <FavoriteActionButtonsCmp
                        numberOfSelected={favoriteSongs.length}
                        objectTitle="bài hát"
                        openModalId={MODAL_ID}
                        saveHandler={saveHandler}
                    />
                </div>

                <FavoriteModalCmp
                    modalTriggerId={MODAL_ID}
                    numberOfSelected={favoriteSongs.length}
                    presentingElement={presentingElement}>
                    <IonList lines="inset" className={styles.list}>
                        {favoriteSongs.map((song) => (
                            <FavoriteItemCmp
                                key={song.id}
                                title={song.title}
                                description={song.artist}
                                thumbnail={
                                    song.thumbnailPath
                                        ? `${process.env.REACT_APP_GENIUS_IMAGE_HOST}${song.thumbnailPath}`
                                        : destineeLogo
                                }
                                thumbnailAlt="song-thumbnail"
                                isChecked={!!favoriteSongs.find((favSong) => favSong.id === song.id)}
                                checkHandler={songSelectHandler.bind(null, song)}
                                isModalItem={true}
                            />
                        ))}
                    </IonList>
                </FavoriteModalCmp>
            </PageContentCmp>
        </IonPage>
    );
};

export default ProfileFavoriteSongSettingPage;
