import moment from 'moment';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileContentCmp from '../../components/profile-content/ProfileContentCmp';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { ExtendedRouteProps } from '../../router/pages';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { changeStatusFriendRequest } from '../../store/call-history/call-history.slice';
import { disableProfileThunk } from '../../store/common.disable';
import { FriendProfileState, resetState as resetFriendProfileState } from '../../store/friend-profile/friend-profile.slice';
import {
    fetchFriendCallHistoriesThunk,
    fetchFriendPostsThunk,
    fetchFriendProfileThunk,
    loadMoreFriendCallHistoriesThunk,
    loadMoreFriendPostsThunk,
} from '../../store/friend-profile/friend-profile.thunk';
import { removeFriend } from '../../store/friend/friend.slice';
import { ProfileState } from '../../store/profile/profile.slice';

const FriendProfilePage: FC<ExtendedRouteProps> = (props) => {
    const dispatch: AppDispatch = useDispatch();

    /* State */
    const { _id } = useSelector((state: RootState) => state.profile) as ProfileState;
    const { loading, profile, callHistories, isCallHistoryDataAvailable, callHistoryCurrentPage, posts, isPostDataAvailable, postCurrentPage } = useSelector(
        (state: RootState) => state.friendProfile,
    ) as FriendProfileState;

    /* Effect */
    useEffect(() => {
        if (!_id || !props.match.params.id) return;
        dispatch(fetchFriendProfileThunk(props.match.params.id)).then((payload: any) => {
            if(!payload.error) return;
            if(payload.payload === '403') {
                dispatch(removeFriend({ id: props.match.params.id! }));
                dispatch(
                    changeStatusFriendRequest({
                        profileId: props.match.params.id!,
                        status: null,
                    }),
                );
            }
            if(payload.payload === '404')
                dispatch(disableProfileThunk(props.match.params.id!));
            props.history.replace(`${TAB_URL}/${PATHS.FRIEND}`);
        }); 

        // if(props.location.pathname.endsWith('/calls')) 
            dispatch(fetchFriendCallHistoriesThunk(props.match.params.id)).then((payload: any) => {
                if (payload.error) props.history.replace(`${TAB_URL}/${PATHS.FRIEND}`);
            });
        
        // if(props.location.pathname.endsWith('/posts'))
            dispatch(fetchFriendPostsThunk(props.match.params.id)).then((payload: any) => {
                if (payload.error) props.history.replace(`${TAB_URL}/${PATHS.FRIEND}`);
            });
    }, [props.match.params.id, _id, props.history, dispatch]);

    useEffect(
        () => () => {
            dispatch(resetFriendProfileState());
        },
        [dispatch],
    );

    /* Handler */
    const loadMorePosts = (e: any) => {
        if (!isPostDataAvailable || !props.match.params.id) return;
        dispatch(loadMoreFriendPostsThunk({ id: props.match.params.id, page: postCurrentPage + 1 })).then(() => e.target.complete());
    };

    const loadMoreCallHistories = (e: any) => {
        if (!isCallHistoryDataAvailable || !props.match.params.id) return;
        dispatch(loadMoreFriendCallHistoriesThunk({ id: props.match.params.id, page: callHistoryCurrentPage + 1 })).then(() =>
            e.target.complete(),
        );
    };

    return (
        <ProfileContentCmp
            renderImagePost={false}
            renderProfileSetting={false}
            renderSendMessage={true}
            renderUploadAvatar={false}
            renderUnfriend={true}
            profile={
                profile && {
                    _id : profile.id,
                    name: profile.name,
                    gender: profile.gender,
                    nickname: '',
                    birthdate: moment(profile.birthdate).toDate(),
                    sex: profile.sex,
                    avatar: profile.avatar,
                    /* Optional */
                    height: profile.height,
                    job: profile.job,
                    workAt: profile.workAt,
                    major: profile.major,
                    origin: profile.origin,
                    languages: profile.languages,
                    hobbies: profile.hobbies,
                    bio: profile.bio,
                    mbtiResult: profile.mbtiResult,
                    conversationId: profile.conversationId,
                }
            }
            loading={loading}
            callHistories={callHistories.map((c) => ({
                ...c,
                other: { ...c.other, avatar: getAvatar(profile?.avatar, TYPE_IMAGE.SQUARE, c.other.gender), mbtiResult: profile?.mbtiResult || null },
            }))}
            posts={posts}
            isPostDataAvailable={isPostDataAvailable}
            isCallHistoryDataAvailable={isCallHistoryDataAvailable}
            loadMoreCallHistories={loadMoreCallHistories}
            loadMorePosts={loadMorePosts}
            {...props}
        />
    );
};

export default FriendProfilePage;
