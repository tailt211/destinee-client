import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/account.slice';
import authReducer from './auth/auth.slice';
import callQuestionReducer from './call-question/call-question.slice';
import callReducer from './call/call.slice';
import personalityTestReducer from './personality-test/personality-test.slice';
import personalityTestHistoryReducer from './personality-test-history/personality-test-history.slice';
import favoriteSettingReducer from './favorite-setting/favorite-setting.slice';
import profileReducer from './profile/profile.slice';
import homeReducer from './home/home.slice';
import callHistoryReducer from './call-history/call-history.slice';
import friendRequestReducer from './friend-request/friend-request.slice';
import conversationReducer from './conversation/conversation.slice';
import messageReducer from './message/message.slice';
import friendReducer from './friend/friend.slice';
import friendProfileReducer from './friend-profile/friend-profile.slice';
import registrationReducer from './registration/registration.slice';
import notificationReducer from './notification/notification.slice';
import myProfileReducer from './my-profile/my-profile.slice';
import queueReducer from './queue/queue.slice';
import orderReducer from './order/order.slice';
import paymentReducer from './payment/payment.slice';

export const store = configureStore({
    reducer: {
        home: homeReducer,
        auth: authReducer,
        account: accountReducer,
        profile: profileReducer,
        callQuestion: callQuestionReducer,
        personalityTest: personalityTestReducer,
        personalityTestHistory: personalityTestHistoryReducer,
        favoriteSetting: favoriteSettingReducer,
        call: callReducer,
        callHistory: callHistoryReducer,
        friendRequest: friendRequestReducer,
        conversation: conversationReducer,
        message: messageReducer,
        friend: friendReducer,
        friendProfile: friendProfileReducer,
        registration: registrationReducer,
        notification: notificationReducer,
        myProfile: myProfileReducer,
        queue: queueReducer,
        order: orderReducer,
        payment: paymentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
