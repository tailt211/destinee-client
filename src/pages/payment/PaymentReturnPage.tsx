import { IonPage, IonRippleEffect, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import disappointedIcon from '../../assets/disappointed-red.png';
import okIcon from '../../assets/oke.png';
import PageContentCmp from '../../components/container/PageContentCmp';
import { packageDisplayer } from '../../model/package-displayer';
import { paymentGatewayDisplayer } from '../../model/payment/payment-gateway-displayer';
import { paymentStatusDisplayer } from '../../model/payment/payment-status-displayer';
import { PAYMENT_STATUS } from '../../model/payment/payment-status.enum';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { AuthState } from '../../store/auth/auth.slice';
import { PaymentState } from '../../store/payment/payment.slice';
import { fetchVnpayTransactionThunk } from '../../store/payment/payment.thunk';
import { vndFormatter } from '../../utils/number.helper';
import { convertToDateTime } from '../../utils/time.helper';
import styles from './PaymentReturnPage.module.scss';

const PaymentReturnPage: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const { search } = history.location;
    /* State */
    const { loading, payment } = useSelector((state: RootState) => state.payment) as PaymentState;
    const { token } = useSelector((state: RootState) => state.auth) as AuthState;
    const isPaymentSucceed = useMemo(() => payment?.status === PAYMENT_STATUS.SUCCEEDED, [payment]);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (!isEmpty(params))
            dispatch(
                fetchVnpayTransactionThunk({
                    vnp_Amount: params.vnp_Amount,
                    vnp_BankCode: params.vnp_BankCode,
                    vnp_BankTranNo: params.vnp_BankTranNo,
                    vnp_CardType: params.vnp_CardType,
                    vnp_OrderInfo: params.vnp_OrderInfo,
                    vnp_PayDate: params.vnp_PayDate,
                    vnp_ResponseCode: params.vnp_ResponseCode,
                    vnp_SecureHash: params.vnp_SecureHash,
                    vnp_TmnCode: params.vnp_TmnCode,
                    vnp_TransactionNo: params.vnp_TransactionNo,
                    vnp_TransactionStatus: params.vnp_TransactionStatus,
                    vnp_TxnRef: params.vnp_TxnRef,
                }),
            );
    }, [dispatch, search]);
    /* Handler */
    const onConfirmHandler = () => {
        history.replace(`${TAB_URL}/${PATHS.HOME}`);
    };

    return (
        <IonPage className="destinee__bg">
            <PageContentCmp scrollY={true} customStyle={{ height: '100%' }}>
                <div className={styles.container}>
                    {loading && <IonSpinner color="white" name="crescent" style={{ top: '50%' }} />}
                    {!loading && payment && (
                        <>
                            <div className={styles.heading}>
                                <h1>Chi tiết giao dịch</h1>
                                <img
                                    src={isPaymentSucceed ? okIcon : disappointedIcon}
                                    alt={isPaymentSucceed ? 'succeed' : 'failed'}
                                />
                                <div className={styles.infoContainer}>
                                    <p className={styles.status}>{paymentStatusDisplayer[payment.status].description}</p>
                                    <p
                                        className={classNames([
                                            styles.price,
                                            { [styles.success]: isPaymentSucceed, [styles.fail]: !isPaymentSucceed },
                                        ])}>
                                        {vndFormatter.format(payment.amount)} {payment.currency}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.description}>
                                <div className={styles.item}>
                                    <span>Cổng thanh toán</span>
                                    <span>{paymentGatewayDisplayer[payment.gateway].displayer}</span>
                                </div>
                                <div className={styles.item}>
                                    <span>Nội dung</span>
                                    <span>{payment.description}</span>
                                </div>
                                <div className={styles.item}>
                                    <span>Thanh toán lúc</span>
                                    <span>{payment.payDate ? convertToDateTime(payment.payDate) : ''}</span>
                                </div>
                                <div className={styles.item}>
                                    <span>Trạng thái</span>
                                    <span>{paymentStatusDisplayer[payment.status].displayer}</span>
                                </div>
                            </div>
                            {payment.package && (
                                <div className={styles.orderContainer}>
                                    <h1>Chi tiết đơn hàng</h1>
                                    <div className={styles.item}>
                                        <span>Dịch vụ</span>
                                        <span>{packageDisplayer[payment.package].serviceDesc}</span>
                                    </div>
                                    <div className={styles.item}>
                                        <span>Hiệu lực đến</span>
                                        <span>{convertToDateTime(payment.expiresDate)}</span>
                                    </div>
                                </div>
                            )}
                            <button
                                disabled={!token}
                                onClick={onConfirmHandler}
                                className={classNames([styles.finishBtn, 'ion-activatable', 'ripple-parent'])}>
                                {!token && <IonSpinner color="white" name="crescent" className="m-auto" />}
                                {token && `Màn hình chính`}
                                <IonRippleEffect />
                            </button>
                        </>
                    )}
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default PaymentReturnPage;
