/* eslint-disable jsx-a11y/anchor-is-valid */
import { yupResolver } from '@hookform/resolvers/yup';
import { IonRippleEffect, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import destineeLogo from '../../assets/destinee-logo.png';
import { AppDispatch, RootState } from '../../store';
import { clearError } from '../../store/registration/registration.slice';
import { registerThunk } from '../../store/registration/registration.thunk';
import styles from './RegisterCmp.module.scss';

const schema = yup
    .object({
        email: yup.string().trim().required('Email không được bỏ trống').email('Email không hợp lệ'),
        password: yup
            .string()
            .trim()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/i, 'Password phải bao gồm chữ và số'),
        confirmPassword: yup
            .string()
            .trim()
            .required('Mật khẩu xác nhận không được trống')
            .oneOf([yup.ref('password'), null], 'Mật khẩu và mật khẩu xác nhận không trùng khớp'),
    })
    .required();

type RegisterCmpProps = {
    onLogin: () => void;
};

interface IFormInput {
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterCmp: FC<RegisterCmpProps> = function ({ onLogin }) {
    const emailRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<IFormInput>({ mode: 'onChange', resolver: yupResolver(schema) });
    /* State */
    const { loading, firebaseError } = useSelector((state: RootState) => state.registration);
    /* Effect */
    useEffect(() => {
        emailRef.current?.focus();
        dispatch(clearError());
    }, [dispatch]);
    /* Handler */
    const registerHandler = () => {
        if (!(errors.email || errors.password || errors.confirmPassword))
            dispatch(registerThunk({ email: watch('email').trim()!, password: watch('password').trim()! }));
    };

    return (
        <div className={styles.container}>
            <img className={styles.logo} src={destineeLogo} alt="logo" />
            <form onSubmit={handleSubmit(registerHandler)}>
                <div className={styles.formContainer}>
                    <div className={styles.inputForm}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            disabled={loading}
                            style={{ border: errors.email ? '1px solid red' : '' }}
                            {...register('email')}
                        />
                        <span>Ví dụ: jungtin@abc.vn</span>
                    </div>
                    <div className={styles.inputForm}>
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            disabled={loading}
                            style={{ border: errors.password ? '1px solid red' : '' }}
                            {...register('password')}
                        />
                        <span>Gợi ý: Ít nhất 8 ký tự và bao gồm số</span>
                    </div>
                    <div className={styles.inputForm}>
                        <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            disabled={loading}
                            style={{ border: errors.confirmPassword ? '1px solid red' : '' }}
                            {...register('confirmPassword')}
                        />
                        <span>Gợi ý: Điền chính xác lại mật khẩu mà bạn đã điền ở trên</span>
                    </div>
                    <ul className={styles.errorContainer}>
                        {firebaseError && <li>{firebaseError}</li>}
                        {errors.email && <li>{errors.email.message}</li>}
                        {errors.password && <li>{errors.password.message}</li>}
                        {errors.confirmPassword && <li>{errors.confirmPassword.message}</li>}
                    </ul>
                </div>
                <div className={styles.actionContainer}>
                    <button type="submit" className={classNames(['ion-activatable', 'ripple-parent'])} disabled={loading}>
                        {!loading && 'Đăng ký'}
                        {loading && <IonSpinner color="white" name="crescent" />}
                        <IonRippleEffect />
                    </button>
                    <div className={styles.otherAction}>
                        <a onClick={onLogin}>Tôi đã có tài khoản, đăng nhập ngay</a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterCmp;
