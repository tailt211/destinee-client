/* eslint-disable jsx-a11y/anchor-is-valid */
import { yupResolver } from '@hookform/resolvers/yup';
import { IonRippleEffect, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import destineeLogo from '../../assets/destinee-logo.png';
import { AppDispatch, RootState } from '../../store';
import { clearError } from '../../store/auth/auth.slice';
import { forgotPasswordThunk } from '../../store/auth/auth.thunk';
import styles from './ForgotPasswordCmp.module.scss';

const schema = yup
    .object({
        email: yup.string().trim().required('Email không được bỏ trống').email('Email không hợp lệ'),
    })
    .required();

type ForgotPasswordProps = {
    onLogin: () => void;
};

interface IFormInput {
    email: string;
}

const ForgotPasswordCmp: FC<ForgotPasswordProps> = function ({ onLogin }) {
    const dispatch = useDispatch<AppDispatch>();
    const emailRef = useRef<HTMLInputElement>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<IFormInput>({ mode: 'onChange', resolver: yupResolver(schema) });
    /* State */
    const { isPasswordReseting, error } = useSelector((state: RootState) => state.auth);
    const [isSentEmail, setIsSentEmail] = useState(false);
    /* Effect */
    useEffect(() => {
        emailRef.current?.focus();
        dispatch(clearError());
    }, [dispatch]);
    /* Handler */
    const loginHandler = (e: any) => {
        if (!errors.email)
            dispatch(forgotPasswordThunk({ email: watch('email').trim()! })).then((payload: any) => {
                if (!payload.error) setIsSentEmail(true);
            });
    };
    return (
        <div className={styles.container}>
            <img className={classNames([styles.logo, { [styles.sent]: isSentEmail }])} src={destineeLogo} alt="logo" />
            {isSentEmail && <p className={styles.sentNoti}>Đã gửi thành công, vui lòng kiểm tra email của bạn</p>}
            <form onSubmit={handleSubmit(loginHandler)}>
                {!isSentEmail && (
                    <div className={styles.formContainer}>
                        <div className={styles.inputForm}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                style={{ border: errors.email ? '1px solid red' : '' }}
                                {...register('email')}
                                disabled={isPasswordReseting}
                            />
                            <span>Nhập email bạn đã dùng đăng ký và đã quên mật khẩu</span>
                        </div>
                        <ul className={styles.errorContainer}>
                            {error && <li>{error}</li>}
                            {errors.email && <li>{errors.email.message}</li>}
                        </ul>
                    </div>
                )}
                <div className={styles.actionContainer}>
                    {!isSentEmail && (
                        <button
                            className={classNames(['ion-activatable', 'ripple-parent'])}
                            type="submit"
                            disabled={isPasswordReseting}>
                            {!isPasswordReseting && 'Yêu cầu đổi mật khẩu'}
                            {isPasswordReseting && <IonSpinner color="white" name="crescent" />}
                            <IonRippleEffect />
                        </button>
                    )}
                    <div className={styles.otherAction}>
                        <a onClick={onLogin}>Quay lại</a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordCmp;
