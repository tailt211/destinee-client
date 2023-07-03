import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonRippleEffect,
    useIonAlert,
} from '@ionic/react';
import classNames from 'classnames';
import { callOutline, gridOutline } from 'ionicons/icons';
import { isEmpty } from 'lodash';
import { ChangeEvent, FC, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import { ConversationDTO } from '../../model/conversation/dto/conversation.dto';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';
import { PersonalInfoDTO } from '../../model/profile/dto/profile-personal-info.dto';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';
import { PageSettingDTO } from '../../model/profile/dto/profile-page-setting.dto';
import { GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch } from '../../store';
import { createConversationThunk } from '../../store/conversation/conversation.thunk';
import { unfriendRequestThunk } from '../../store/friend-request/friend-request.thunk';
import { syncProfile } from '../../store/message/message.slice';
import PageContentCmp from '../container/PageContentCmp';
import ProfileInfoCmp from '../profile/profile-card/ProfileInfoCmp';
import ProfileCallHistoriesCmp from '../profile/ProfileCallHistoriesCmp';
import ProfilePostsCmp from '../profile/ProfilePostsCmp';
import AvatarToolbarCmp from '../toolbar/AvatarToolbarCmp';
import styles from './ProfileContentCmp.module.scss';
import SkeletonHeaderCmp from './SkeletonHeaderCmp';

type ProfileType = Omit<ProfileDTO, 'personalInfo' | 'profilePageSetting' | 'callSetting'> &
    Omit<PersonalInfoDTO, 'favoriteSongs' | 'favoriteBooks' | 'favoriteMovies' | 'birthdate'> &
    Pick<PageSettingDTO, 'bio'> & { birthdate: Date; conversationId: string | null };

type ProfileContentCmpProps = RouteComponentProps & {
    loading?: boolean;
    isSubmitting?: boolean;
    profile?: Partial<ProfileType>;
    callHistories?: CallHistoryDTO[];
    isCallHistoryDataAvailable?: boolean;
    posts: PostOverallDTO[];
    isPostDataAvailable?: boolean;
    uploadAvatarHandler?: (event: ChangeEvent<HTMLInputElement>) => void;
    loadMorePosts?: (event: CustomEvent<void>) => void;
    loadMoreCallHistories?: (event: CustomEvent<void>) => void;

    /* Render Option */
    renderSendMessage: boolean;
    renderUploadAvatar: boolean;
    renderProfileSetting: boolean;
    renderImagePost: boolean;
    renderUnfriend: boolean;
};

const ProfileContentCmp: FC<ProfileContentCmpProps> = function ({
    match,
    location,
    history,
    loading = false,
    isSubmitting = false,
    profile,
    callHistories,
    isCallHistoryDataAvailable,
    posts,
    isPostDataAvailable,
    uploadAvatarHandler,
    loadMorePosts,
    loadMoreCallHistories,

    /* Render Option */
    renderSendMessage,
    renderUploadAvatar,
    renderProfileSetting,
    renderImagePost,
    renderUnfriend,
}) {
    const avatarLayerClasses = classNames([styles.avatarLayer, { [styles.upload]: renderUploadAvatar }]);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const dispatch: AppDispatch = useDispatch();
    const [presentAlert] = useIonAlert();
    /* Options */
    const loadMoreOptions = useMemo(() => {
        if (posts && location.pathname.includes('/posts'))
            return { title: 'Đang tải thêm bài viết', isDataAvailable: isPostDataAvailable, loadFn: loadMorePosts };
        if (callHistories && location.pathname.includes('/calls'))
            return {
                title: 'Đang tải thêm lịch sử cuộc gọi',
                isDataAvailable: isCallHistoryDataAvailable,
                loadFn: loadMoreCallHistories,
            };
        return { title: '', isDataAvailable: false, loadFn: () => {} };
    }, [
        location.pathname,
        posts,
        callHistories,
        isPostDataAvailable,
        isCallHistoryDataAvailable,
        loadMorePosts,
        loadMoreCallHistories,
    ]);

    const confirmUnfriendHandler = () => {
        presentAlert({
            backdropDismiss: false,
            header: `Hủy kết bạn với ${profile?.name}`,
            buttons: [{ text: 'Hủy kết bạn', handler: () => unfriendHandler() }, { text: 'Bỏ' }],
        });
        return;
    };

    const unfriendHandler = () => {
        if (profile?._id)
            dispatch(unfriendRequestThunk({ profileId: profile._id })).then(() => {
                history.replace(`${TAB_URL}/${PATHS.FRIEND}`);
            });
    };

    const chatHandler = async () => {
        if (!profile) return;
        if (profile.conversationId) {
            history.push(`/${PATHS.DIRECT}/${profile.conversationId}`);
            return;
        }
        const result = await dispatch(
            createConversationThunk({
                body: { profileId: profile._id! },
                profile: {
                    id: profile._id!,
                    name: profile.name!,
                    gender: profile.gender!,
                    avatar: getAvatar(profile.avatar, TYPE_IMAGE.SQUARE, profile.gender!),
                    disabled: false,
                },
            }),
        );
        if (result.meta.requestStatus === 'fulfilled') {
            const conversation = result.payload as ConversationDTO;
            dispatch(
                syncProfile({
                    id: profile._id!,
                    name: profile.name!,
                    gender: profile.gender!,
                    avatar: getAvatar(profile.avatar, TYPE_IMAGE.SQUARE, profile.gender!),
                    disabled: false,
                }),
            );
            history.push(`/${PATHS.DIRECT}/${conversation.id}`);
        }
    };

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <AvatarToolbarCmp />
            </IonHeader>
            <PageContentCmp customStyle={{ color: 'white', paddingTop: '17px' }}>
                <div className={styles.container}>
                    <IonContent className={classNames([styles.ionContent, 'no-scroll-bar'])}>
                        <div className={styles.contentContainer}>
                            <div className={styles.header}>
                                {!profile && <SkeletonHeaderCmp />}
                                {profile && (
                                    <>
                                        <div className={styles.headerContentContainer}>
                                            {renderUploadAvatar && (
                                                <input
                                                    type="file"
                                                    ref={inputFileRef}
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={uploadAvatarHandler}
                                                />
                                            )}
                                            <div className={styles.avatarWrapper}>
                                                <div
                                                    className={avatarLayerClasses}
                                                    onClick={() => {
                                                        inputFileRef.current?.click();
                                                    }}>
                                                    <img
                                                        src={getAvatar(
                                                            profile?.avatar,
                                                            TYPE_IMAGE.SQUARE,
                                                            profile?.gender || GENDER.MALE,
                                                        )}
                                                        alt="avatar"
                                                    />
                                                </div>
                                                {renderSendMessage && (
                                                    <button
                                                        className={classNames([
                                                            styles.btnMessage,
                                                            'ion-activatable',
                                                            'ripple-parent',
                                                        ])}
                                                        onClick={chatHandler}>
                                                        Nhắn tin
                                                        <IonRippleEffect />
                                                    </button>
                                                )}
                                                {renderUnfriend && (
                                                    <button
                                                        className={classNames([
                                                            styles.btnMessage,
                                                            'ion-activatable',
                                                            'ripple-parent',
                                                        ])}
                                                        onClick={confirmUnfriendHandler}>
                                                        Hủy kết bạn
                                                        <IonRippleEffect />
                                                    </button>
                                                )}
                                            </div>
                                            {profile && (
                                                <ProfileInfoCmp
                                                    callInfo={{
                                                        name: profile.name,
                                                        gender: profile.gender,
                                                        nickname: profile.nickname,
                                                        birthdate: profile.birthdate,
                                                        sex: profile.sex,
                                                        mbtiResult: profile.mbtiResult,
                                                        /* Optional */
                                                        height: profile.height,
                                                        job: profile.job,
                                                        workAt: profile.workAt,
                                                        major: profile.major,
                                                        origin: profile.origin,
                                                        languages: profile.languages,
                                                        hobbies: profile.hobbies,
                                                    }}
                                                    color="var(--ion-color-white)"
                                                    paddingTop={0}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                                {!isEmpty(profile?.bio) && <span className={styles.bio}>“{profile?.bio}”</span>}
                                {renderProfileSetting && (
                                    <IonButton
                                        fill="clear"
                                        routerLink={`/${PATHS.PROFILE_SETTING}`}
                                        className={classNames([styles.btn, styles.btnProfileSetting])}>
                                        Chỉnh sửa trang cá nhân
                                        <IonRippleEffect />
                                    </IonButton>
                                )}
                            </div>

                            {/* Route & Navigation */}
                            <div className={styles.tabsAction}>
                                <NavLink to={`posts`} activeClassName={styles.active} replace exact>
                                    <IonIcon icon={gridOutline} />
                                </NavLink>
                                {callHistories && (
                                    <NavLink to={`calls`} activeClassName={styles.active} replace>
                                        <IonIcon icon={callOutline} />
                                    </NavLink>
                                )}
                            </div>
                            <Route
                                path={[`/${PATHS.MY_PROFILE}/posts`, `/${PATHS.FRIEND_PROFILE}/:id/:slug/posts`]}
                                exact
                                component={() => (
                                    <ProfilePostsCmp
                                        isSubmitting={isSubmitting}
                                        loading={loading}
                                        posts={posts}
                                        renderImageUpload={renderImagePost}
                                    />
                                )}
                            />
                            {callHistories && (
                                <Route
                                    path={`/${PATHS.FRIEND_PROFILE}/:id/:slug/calls`}
                                    exact
                                    component={() => <ProfileCallHistoriesCmp loading={loading} histories={callHistories} />}
                                />
                            )}
                            <Redirect exact to={`${match.url}/posts`} />
                            <IonInfiniteScroll
                                onIonInfinite={loadMoreOptions.loadFn}
                                threshold="100px"
                                disabled={!loadMoreOptions.isDataAvailable}>
                                <IonInfiniteScrollContent loadingSpinner="crescent" loadingText={loadMoreOptions.title} />
                            </IonInfiniteScroll>
                        </div>
                    </IonContent>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default ProfileContentCmp;
