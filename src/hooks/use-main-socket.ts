import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { AppDispatch, RootState } from '../store';
import { setOnlineUser } from '../store/home/home.slice';
import { APP_ONLINE_USERS } from '../utils/gateway-event';

export interface UseMainSocketReturn {
    mainSocket?: Socket;
}

export default function useMainSocket(): UseMainSocketReturn {
    const [mainSocket, setMainSocket] = useState<Socket>();
    const dispatch: AppDispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth);
    const { _id: profileId } = useSelector((state: RootState) => state.profile);

    /* Initialize Socket */
    useEffect(() => {
        if (!profileId) return;
        console.info('Init main socket...');
        const socket = io(process.env.REACT_APP_SOCKET_URL + '/', {
            path: process.env.REACT_APP_SOCKET_PATH,
            transports: ['websocket'],
            auth: { Authorization: token },
            upgrade: false,
        });
        setMainSocket(socket);
    }, [profileId, token]);

    useEffect(() => {
        /* Xử lý khi logout */
        if (!token && mainSocket) {
            mainSocket.disconnect();
        }
    }, [token, mainSocket]);

    /* Handle Socket Event */
    useEffect(() => {
        if (!mainSocket) return;
        mainSocket.on('WS_EXCEPTION', (err: any) => console.error(err));
        mainSocket.on(APP_ONLINE_USERS, (online: number) => {
            dispatch(setOnlineUser(online));
        });
        mainSocket.on('connect', () =>
            console.info('[Main Socket] Connected', mainSocket.id),
        );
        mainSocket.on('disconnect', () => {
            console.info('[Main Socket] Disconnected', mainSocket.id);
            setMainSocket(undefined);
        });
    }, [mainSocket, dispatch]);

    return { mainSocket };
}
