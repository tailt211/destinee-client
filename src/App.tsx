import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';
import ModalContainerCmp from './components/container/ModalContainerCmp';
import ForgotPasswordCmp from './components/welcome/ForgotPasswordCmp';
import LoginCmp from './components/welcome/LoginCmp';
import RegisterCmp from './components/welcome/RegisterCmp';
import WelcomeCmp from './components/welcome/WelcomeCmp';
import useAuth from './hooks/use-auth';
import useToast from './hooks/use-toast';
import Pages from './pages/Pages';
import Tabs from './pages/Tabs';
import pages from './router/pages';
import { TAB_URL } from './router/tabs';
import { AppDispatch, RootState } from './store';
import { AccountState } from './store/account/account.slice';
import { getLocalStorageToken } from './store/auth/auth.service';
import { AuthState } from './store/auth/auth.slice';
import { fetchAppDependencies } from './store/auth/auth.thunk';
import { NotificationState } from './store/notification/notification.slice';

import './theme/custom.scss';
/* Tailwind styles */
import './theme/tailwind.css';
/* Theme variables */
import './theme/variables.css';

setupIonicReact({
    mode: 'ios',
});

const App: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    useAuth();
    useToast();
    /* State */
    const [modal, setModal] = useState<'login' | 'register' | 'forgotPassword' | null>(null);
    const { token, loading: authLoading } = useSelector((state: RootState) => state.auth) as AuthState;
    const { notificationTitle } = useSelector((state: RootState) => state.notification) as NotificationState;
    const { upgrade } = useSelector((state: RootState) => state.account) as AccountState;
    const localToken = useMemo(() => (token || getLocalStorageToken()), [token]);
    /* Effect */
    useEffect(() => {
        setModal(null);
    }, [token]);

    useEffect(() => {
        const DEFAULT_TITLE = 'Destinee';
        let _: NodeJS.Timeout;
        if (notificationTitle) {
            _ = setInterval(() => {
                document.title = document.title === DEFAULT_TITLE ? notificationTitle : DEFAULT_TITLE;
            }, 1000);
        }
        document.title = DEFAULT_TITLE;
        return () => clearInterval(_);
    }, [notificationTitle]);

    useEffect(() => {
        let _: NodeJS.Timeout | undefined = undefined;
        if (upgrade) {
            _ = setInterval(() => {
                if(moment(upgrade.expiresDate).isSameOrBefore()) 
                    dispatch(fetchAppDependencies());
            }, 2500);
        } else clearInterval(_);
        return () => clearInterval(_);
    }, [upgrade, dispatch]);

    return (
        <IonApp>
            {authLoading && !!localToken && (
                <ModalContainerCmp open={authLoading && !!localToken} dialogPanelClasses="mt-[-15px] h-screen flex items-center">
                    <IonSpinner />
                </ModalContainerCmp>
            )}
            <ModalContainerCmp open={!localToken} dialogPanelClasses="w-full">
                {modal === null && (
                    <WelcomeCmp
                        onLogin={() => setModal('login')}
                        onRegister={() => {
                            setModal('register');
                        }}
                    />
                )}
                {modal === 'login' && (
                    <LoginCmp onRegister={() => setModal('register')} onForgotPassword={() => setModal('forgotPassword')} />
                )}
                {modal === 'register' && <RegisterCmp onLogin={() => setModal('login')} />}
                {modal === 'forgotPassword' && <ForgotPasswordCmp onLogin={() => setModal('login')} />}
            </ModalContainerCmp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route path={TAB_URL} component={Tabs} />
                    <Pages pages={pages} />
                    <Redirect exact from="/" to={TAB_URL} />
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
