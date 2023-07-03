import React from 'react';
import useCallSocket, { UseCallSocketReturn } from '../hooks/use-call-socket';
import useMainSocket, { UseMainSocketReturn } from '../hooks/use-main-socket';
import useNotificationSocket, {
    UseNotificationSocketReturn,
} from '../hooks/use-notification-socket';

const SocketContext = React.createContext<
    UseMainSocketReturn & UseCallSocketReturn & UseNotificationSocketReturn
>({
    mainSocket: undefined,
    callSocket: undefined,
    notificationSocket: undefined,
    startFindingCall: () => Promise.resolve(),
    continueFindingCall: () => {},
    stopFindingCall: () => Promise.resolve(),
    requestQuestionaire: () => {},
    rejectQuestionaire: () => {},
    submitAnswers: () => {},
    endCall: () => {},
    peering: () => {},
    // onLogin: (email, password) => {}
});

export const SocketContextProvider = (props: any) => {
    const mainSocketHook = useMainSocket();
    const callSocketHook = useCallSocket({ mainSocket: mainSocketHook.mainSocket });
    const notificationSocketHook = useNotificationSocket({
        mainSocket: mainSocketHook.mainSocket,
    });

    return (
        <SocketContext.Provider
            value={{
                ...mainSocketHook,
                ...callSocketHook,
                ...notificationSocketHook,
            }}>
            {props.children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
