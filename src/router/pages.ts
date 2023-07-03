import { RouteComponentProps } from 'react-router';
import { menuPages } from '../components/toolbar/MainToolbarCmp';
import CallFindingPage from '../pages/call-finding/CallFindingPage';
import CallRatingPage from '../pages/call-rating/CallRatingPage';
import CallResultPage from '../pages/call-result/CallResultPage';
import DirectMessagePage from '../pages/chatting/DirectMessagePage';
import FriendRequestsPage from '../pages/friend-request/FriendRequestsPage';
import CallPage from '../pages/on-calling/CallPage';
import PersonalityTestPage from '../pages/personality-test/PersonalityTestPage';
import PersonalityTestProcessPage from '../pages/personality-test/PersonalityTestProcessPage';
import PersonalityTestType from '../pages/personality-test/PersonalityTestType';
import ProfileFavoriteMovieSettingPage from '../pages/setting/ProfileFavoriteMovieSettingPage';
import ProfileFavoriteSongSettingPage from '../pages/setting/ProfileFavoriteSongSettingPage';
import ProfileSettingPage from '../pages/setting/ProfileSettingPage';
import { PATHS } from './paths';
import FriendProfile from '../pages/friend-profile/FriendProfilePage';
import RegistrationPage from '../pages/registration/RegistrationPage';
import QueueSetupPage from '../pages/queue-setup/QueueSetupPage';
import PaymentReturnPage from '../pages/payment/PaymentReturnPage';

export type ExtendedRouteProps = RouteComponentProps<{
    id?: string;
    name?: string;
    slug: string;
    conversationId?: string;
}>;

export interface RoutePage {
    name: string;
    path: string;
    component: React.FC<RouteComponentProps> | React.FC<ExtendedRouteProps>;
    exact: boolean;
}

const pages: RoutePage[] = [
    {
        name: 'Đánh giá cuộc gọi',
        path: PATHS.CALL_RATING,
        component: CallRatingPage,
        exact: true,
    },
    {
        name: 'Tuỳ chỉnh cuộc gọi',
        path: PATHS.QUEUE_SETUP,
        component: QueueSetupPage,
        exact: true,
    },
    {
        name: 'Tìm kiếm cuộc gọi',
        path: PATHS.CALL_FINDING,
        component: CallFindingPage,
        exact: true,
    },
    {
        name: 'Chỉnh sửa trang cá nhân',
        path: PATHS.PROFILE_SETTING,
        component: ProfileSettingPage,
        exact: true,
    },
    {
        name: 'Kết quả trả lời',
        path: PATHS.CALL_RESULT,
        component: CallResultPage,
        exact: true,
    },
    {
        name: 'Tiến trình trắc nghiệm',
        path: `${PATHS.PERSONALITY_TEST_PROCESS}/:id/processing`,
        component: PersonalityTestProcessPage,
        exact: true,
    },
    {
        name: 'Chi tiết lịch sử trắc nghiệm',
        path: `${PATHS.PERSONALITY_TEST}/:id`,
        component: PersonalityTestPage,
        exact: true,
    },
    {
        name: 'Phân loại tính cách',
        path: PATHS.PERSONALITY_TEST_TYPE,
        component: PersonalityTestType,
        exact: true,
    },
    {
        name: 'Đàm thoại ẩn danh',
        path: PATHS.CALL,
        component: CallPage,
        exact: false,
    },
    {
        name: 'Nhắn tin',
        path:`${PATHS.DIRECT}/:conversationId`,
        component: DirectMessagePage,
        exact: false,
    },
    {
        name: 'Cập nhật bài hát yêu thích',
        path: PATHS.FAVORITE_SONG_SETTING,
        component: ProfileFavoriteSongSettingPage,
        exact: true,
    },
    {
        name: 'Cập nhật bộ phim yêu thích',
        path: PATHS.FAVORITE_MOVIE_SETTING,
        component: ProfileFavoriteMovieSettingPage,
        exact: true,
    },
    {
        name: 'Bạn bè',
        path: PATHS.FRIEND_REQUEST,
        component: FriendRequestsPage,
        exact: true,
    },
    {
        name: 'Thông tin bạn bè',
        path: `${PATHS.FRIEND_PROFILE}/:id/:slug`,
        component: FriendProfile,
        exact: false,
    },
    {
        name: 'Đăng ký',
        path: PATHS.REGISTRATION,
        component: RegistrationPage,
        exact: true,
    },
    {
        name: 'Thông tin thanh toán',
        path: PATHS.PAYMENT_RETURN,
        component: PaymentReturnPage,
        exact: true,
    },
    ...menuPages,
];

export default pages;

/* 
    Note:
    - Với page nào có childRoute -> exact: false & ngược lại
*/
