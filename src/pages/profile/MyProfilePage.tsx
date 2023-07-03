import { ChangeEvent, FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import ProfileContentCmp from '../../components/profile-content/ProfileContentCmp';
import { myProfileDisplayer } from '../../model/profile/my-profile-displayer';
import { AppDispatch, RootState } from '../../store';
import { AuthState } from '../../store/auth/auth.slice';
import { MyProfileState, resetState as resetMyProfileState } from '../../store/my-profile/my-profile.slice';
import { fetchMyPostsThunk, loadMoreMyPostsThunk } from '../../store/my-profile/my-profile.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import { uploadAvatarThunk } from '../../store/profile/profile.thunk';

const ProfilePage: FC<RouteComponentProps> = function (props) {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { token } = useSelector((state: RootState) => state.auth) as AuthState;
    const profile = useSelector((state: RootState) => state.profile) as ProfileState;
    const { posts, loading, isDataAvailable, isSubmitting, currentPage } = useSelector(
        (state: RootState) => state.myProfile,
    ) as MyProfileState;

    /* Handler */
    const uploadAvatarHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (!file) return;
        dispatch(uploadAvatarThunk({ file: file, profileId: profile._id }));
    };

    const loadMorePosts = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreMyPostsThunk(currentPage + 1)).then(() => e.target.complete());
    };

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchMyPostsThunk());
        return () => {
            dispatch(resetMyProfileState());
        };
    }, [dispatch, token]);

    return (
        <ProfileContentCmp
            renderImagePost={true}
            renderProfileSetting={true}
            renderSendMessage={false}
            renderUploadAvatar={true}
            renderUnfriend={false}
            profile={!profile.loading ? myProfileDisplayer(profile, 'profile-page-setting') : undefined}
            uploadAvatarHandler={uploadAvatarHandler}
            loading={loading}
            isSubmitting={isSubmitting}
            posts={posts}
            isPostDataAvailable={isDataAvailable}
            loadMorePosts={loadMorePosts}
            {...props}
        />
    );
};

export default ProfilePage;
