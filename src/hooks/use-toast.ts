import { useIonToast } from '@ionic/react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FRIEND_REQUEST_PROCESS_STATUS } from '../model/friend-request/friend-request-process-status.enum';
import { AppDispatch, RootState } from '../store';
import { AuthState } from '../store/auth/auth.slice';
import { CallHistoryState } from '../store/call-history/call-history.slice';
import { CallState, clearError as clearCallError } from '../store/call/call.slice';
import { clearError as clearOrderError, OrderState } from '../store/order/order.slice';
import { clearError as clearPaymentError, PaymentState } from '../store/payment/payment.slice';
import { PersonalityTestHistoryState } from '../store/personality-test-history/personality-test-history.slice';
import { clearNewTest, PersonalityTestState } from '../store/personality-test/personality-test.slice';
import {
    clearError as clearProfileError,
    clearUpdateNotification as clearProfileUpdateNotification,
    ProfileState,
} from '../store/profile/profile.slice';
import { getToast } from '../utils/toast.helper';
import { PERSONALITY_TEST_PROCESSING_STATE } from './../model/personality-test/personality-test-processing-state.enum';

const useToast = () => {
    const dispatch: AppDispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth) as AuthState;
    const { updated: profileUpdated, error: profileError } = useSelector((state: RootState) => state.profile) as ProfileState;
    const { error: callError } = useSelector((state: RootState) => state.call) as CallState;
    const { newTest } = useSelector((state: RootState) => state.personalityTest) as PersonalityTestState;
    const { testHistories } = useSelector((state: RootState) => state.personalityTestHistory) as PersonalityTestHistoryState;
    const [present, dismiss] = useIonToast();
    const { isSended } = useSelector((state: RootState) => state.callHistory) as CallHistoryState;
    const { error: orderError } = useSelector((state: RootState) => state.order) as OrderState;
    const { error: paymentError } = useSelector((state: RootState) => state.payment) as PaymentState;

    useEffect(() => {
        if (!token) return;
        present({
            buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
            message: 'Vừa đăng nhập thành công',
            color: 'green',
            cssClass: 'text-white',
            header: 'Đăng nhập',
            duration: 3000,
        });
    }, [token, present, dismiss, dispatch]);

    const profileToast = useMemo(() => getToast('Hồ sơ cá nhân', dismiss), [dismiss]);
    useEffect(() => {
        if (profileUpdated)
            present(
                profileToast('Cập nhật thành công', 'success', 500, () => {
                    dispatch(clearProfileUpdateNotification());
                }),
            );
        if (profileError)
            present(
                profileToast(profileError, 'fail', 10000, () => {
                    dispatch(clearProfileError());
                }),
            );
    }, [profileError, profileUpdated, profileToast, present, dismiss, dispatch]);

    const friendRequestToast = useMemo(() => getToast('Yêu cầu kết bạn', dismiss), [dismiss]);
    useEffect(() => {
        if (isSended === FRIEND_REQUEST_PROCESS_STATUS.DEFAULT || !isSended) return;
        if (isSended === FRIEND_REQUEST_PROCESS_STATUS.ADD_FRIEND)
            present(
                friendRequestToast('Đã gửi yêu cầu kết bạn thành công', 'success', 2000, () => {
                    dispatch(clearProfileUpdateNotification());
                }),
            );
        if (isSended === FRIEND_REQUEST_PROCESS_STATUS.ACCEPTED)
            present(
                friendRequestToast('Đã xử lý yêu cầu kết bạn thành công', 'success', 2000, () => {
                    dispatch(clearProfileUpdateNotification());
                }),
            );
        if (isSended === FRIEND_REQUEST_PROCESS_STATUS.DENIED)
            present(
                friendRequestToast('Đã xử lý hủy yêu cầu kết bạn thành công', 'success', 2000, () => {
                    dispatch(clearProfileUpdateNotification());
                }),
            );
    }, [isSended, present, dismiss, dispatch, friendRequestToast]);

    useEffect(() => {
        const lastTest = testHistories[0];
        if (!newTest || !lastTest) return;
        if (
            lastTest.processingState !== PERSONALITY_TEST_PROCESSING_STATE.NOT_READY &&
            lastTest.processingState !== PERSONALITY_TEST_PROCESSING_STATE.PENDING
        )
            return;
        present({
            buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
            message: 'Đã xoá bài trắc nghiệm thành công',
            color: 'green',
            cssClass: 'text-white',
            header: 'Trắc nghiệm tính cách',
            duration: 4000,
            onDidDismiss(event) {
                dispatch(clearNewTest());
            },
        });
    }, [newTest, testHistories, present, dismiss, dispatch]);

    useEffect(() => {
        if (!callError) return;
        present({
            buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
            message: callError,
            color: 'danger',
            cssClass: 'text-white',
            header: 'Tìm kiếm cuộc gọi',
            duration: 4000,
            onDidDismiss(event) {
                dispatch(clearCallError());
            },
        });
    }, [callError, present, dismiss, dispatch]);

    /* 
    * ORDER
    */
    const orderToast = useMemo(() => getToast('Đơn hàng', dismiss), [dismiss]);
    useEffect(() => {
        if(!orderError) return;
        present(
            orderToast(orderError, 'fail', 2000, () => {
                dispatch(clearOrderError());
            }),
        );
    }, [orderError, present, orderToast, dispatch]);

    /* 
    * PAYMENT
    */
    const paymentToast = useMemo(() => getToast('Giao dịch', dismiss), [dismiss]);
    useEffect(() => {
        if(!paymentError) return;
        present(
            paymentToast(paymentError, 'fail', 2000, () => {
                dispatch(clearPaymentError());
            }),
        );
    }, [paymentError, present, paymentToast, dispatch]);
};

export default useToast;
