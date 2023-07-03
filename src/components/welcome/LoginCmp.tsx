/* eslint-disable jsx-a11y/anchor-is-valid */
import { IonRippleEffect, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import destineeLogo from '../../assets/destinee-logo.png';
import { AppDispatch, RootState } from '../../store';
import { loginThunk } from '../../store/auth/auth.thunk';
import styles from './LoginCmp.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { clearError } from '../../store/auth/auth.slice';

const schema = yup
    .object({
        email: yup.string().trim().required('Email không được bỏ trống').email('Email không hợp lệ'),
        password: yup
            .string()
            .trim()
            .required('Mật khẩu không được bỏ trống')
    })
    .required();

type LoginCmpProps = {
    onRegister: () => void;
    onForgotPassword: () => void;
};

const LoginCmp: FC<LoginCmpProps> = function ({ onRegister, onForgotPassword }) {
    const dispatch = useDispatch<AppDispatch>();
    const emailRef = useRef<HTMLInputElement>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<IFormInput>({ mode: 'onChange', resolver: yupResolver(schema) });
    /* State */
    const { isLoggingIn, error } = useSelector((state: RootState) => state.auth);
    /* Effect */
    useEffect(() => {
        emailRef.current?.focus();
        dispatch(clearError());
    }, [dispatch]);
    /* Handler */
    const loginHandler = (e: any) => {
        if (!(errors.email || errors.password))
            dispatch(loginThunk({ email: watch('email').trim()!, password: watch('password').trim()! }));
    };

    interface IFormInput {
        email: string;
        password: string;
    }

    return (
        <div className={styles.container}>
            <img className={styles.logo} src={destineeLogo} alt="logo" />
            <form onSubmit={handleSubmit(loginHandler)}>
                <div className={styles.formContainer}>
                    <div className={styles.inputForm}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            style={{ border: errors.email ? '1px solid red' : '' }}
                            {...register('email')}
                            disabled={isLoggingIn}
                        />
                    </div>
                    <div className={styles.inputForm}>
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            style={{ border: errors.password ? '1px solid red' : '' }}
                            {...register('password')}
                            disabled={isLoggingIn}
                        />
                    </div>
                    <ul className={styles.errorContainer}>
                        {error && <li>{error}</li>}
                        {errors.email && <li>{errors.email.message}</li>}
                        {errors.password && <li>{errors.password.message}</li>}
                    </ul>
                </div>
                <div className={styles.actionContainer}>
                    <button className={classNames(['ion-activatable', 'ripple-parent'])} type="submit" disabled={isLoggingIn}>
                        {!isLoggingIn && 'Đăng nhập'}
                        {isLoggingIn && <IonSpinner color="white" name="crescent" />}
                        <IonRippleEffect />
                    </button>

                    <div className={styles.otherAction}>
                        <a onClick={onForgotPassword}>Tôi quên mật khẩu mất rồi</a>
                        <div className={styles.line} />
                        <a onClick={onRegister}>Tôi chưa có tài khoản, đăng ký ngay</a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginCmp;
