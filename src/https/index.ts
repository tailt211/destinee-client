import axios from 'axios';
import { auth } from '../firebase';
import { getLocalStorageToken } from '../store/auth/auth.service';
import { logoutThunk, refreshTokenThunk } from '../store/auth/auth.thunk';

export const destineeApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const setupInterceptor = (store: any) => {
    destineeApi.interceptors.request.use(async (config) => {
        const tokenResult = getLocalStorageToken();
        if (tokenResult && auth.currentUser) {
            const curDate = new Date();
            curDate.setSeconds(curDate.getSeconds() + 10);
            if (curDate.getTime() >= tokenResult.tokenExpiresTime) {
                const tokenResult = (await store.dispatch(refreshTokenThunk(auth.currentUser))).payload;
                config.headers = { Authorization: `Bearer ${tokenResult.token}` };
            }
        }
        return config;
    });

    destineeApi.interceptors.response.use(
        (response) => response,
        (error) => {
            if (401 === error.response.status) store.dispatch(logoutThunk());
            else return Promise.reject(error);
        },
    );
};
