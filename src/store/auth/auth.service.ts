import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { has } from 'lodash';
import { auth } from '../../firebase';
import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { FIREBASE_REGISTRATION_TOKEN_KEY, FIREBASE_TOKEN_KEY } from './auth.constant';

export const loginFirebase = async (email: string, password: string) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found')
            throw new Error('Sai tên tài khoản hoặc mật khẩu');
        if (err.code === 'auth/too-many-requests') throw new Error('Đăng nhập sai quá nhiều lần, vui lòng thử lại sau');
        if (err.code === 'auth/user-disabled') throw new Error('Tài khoản đã bị vô hiệu hoá, vui lòng thử lại sau');
        throw err;
    }
};

export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email, { url: window.location.origin });
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found') throw new Error('Không tìm thấy email này');
        if (err.code === 'auth/too-many-requests') throw new Error('Bạn đã gửi yêu cầu quá nhiều lần, vui lòng thử lại sau');
        if (err.code === 'auth/user-disabled') throw new Error('Tài khoản đã bị vô hiệu hoá, vui lòng thử lại sau');
        throw err;
    }
};

export const setLocalStorageToken = (token: string, expiresTime: number) => {
    localStorage.setItem(
        FIREBASE_TOKEN_KEY,
        JSON.stringify({
            token: token,
            tokenExpiresTime: expiresTime,
        }),
    );
};

export const clearLocalStorageToken = () => {
    localStorage.removeItem(FIREBASE_TOKEN_KEY);
    localStorage.removeItem(FIREBASE_REGISTRATION_TOKEN_KEY);
};

export const getLocalStorageToken: () => {
    token: string;
    tokenExpiresTime: number;
} = () => {
    const token = localStorage.getItem(FIREBASE_TOKEN_KEY);
    if (!token) return null;

    let parsedToken;
    try {
        parsedToken = JSON.parse(token);
    } catch (err) {
        return null;
    }

    if (!has(parsedToken, 'token') || !has(parsedToken, 'tokenExpiresTime')) return null;
    return parsedToken;
};

export const addRegistrationToken = async (token: string) => {
    try {
        await destineeApi.post(`/profiles/registration-token`, { token });
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi thêm registration token');
    }
};

export const removeRegistrationToken = async (token: string) => {
    try {
        await destineeApi.delete(`/profiles/registration-token`, { data: { token } });
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi xoá registration token');
    }
};

export const setLocalStorageRegistrationToken = (token: string) => {
    localStorage.setItem(FIREBASE_REGISTRATION_TOKEN_KEY, token);
};

export const getLocalStorageRegistrationToken = () => {
    const token = localStorage.getItem(FIREBASE_REGISTRATION_TOKEN_KEY);
    return token || null;
};
