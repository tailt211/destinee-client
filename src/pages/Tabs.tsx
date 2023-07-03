import { IonBadge, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { FC, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router';
import useRegistration from '../hooks/use-registration';
import tabs, { defaultTab, TAB_URL } from '../router/tabs';
import { AppDispatch, RootState } from '../store';
import { seenNotificationsThunk } from '../store/notification/notification.thunk';
import UIEffectContext from '../store/UIEffectContext';

interface LocationProps {
    isPeronalityTest?: boolean;
}

const Tabs: FC = () => {
    const { vibrate } = useContext(UIEffectContext);
    useRegistration();
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const isPeronalityTest = location.state ? (location.state as LocationProps).isPeronalityTest : false;
    /* State */
    const { unseenCount: unseenNotificationCount } = useSelector((state: RootState) => state.notification);
    const { token } = useSelector((state: RootState) => state.auth);
    const { unseenNotificationIds } = useSelector((state: RootState) => state.notification);
    const activeTab = useMemo(() => {
        if (!location.pathname.includes('tabs')) return;
        const regex = /\/tabs\/([-|\w]+)/gm;
        const group = regex.exec(location.pathname);
        const tab = group ? group[1] : null;
        return tab;
    }, [location]);
    /* Effect */
    useEffect(() => {
        if (!token || activeTab !== 'notification' || unseenNotificationIds.length === 0) return;
        dispatch(seenNotificationsThunk(unseenNotificationIds));
    }, [token, activeTab, unseenNotificationIds, dispatch]);

    return (
        // <IonTabs onIonTabsDidChange={(e) => setActiveTab(e.detail.tab)}> // không work khi sử dụng history
        <IonTabs>
            <IonRouterOutlet>
                {tabs.map((tab, index) => {
                    return <Route key={index} exact path={`${TAB_URL}/${tab.path}`} component={tab.component} />;
                })}
                <Redirect exact from={TAB_URL} to={`${TAB_URL}/${defaultTab.path}`} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom" hidden={isPeronalityTest}>
                {tabs.map((tab, barIndex) => {
                    const active = tab.name === activeTab;
                    return (
                        <IonTabButton onClick={vibrate.bind(null, 'xs')} key={`tab_${barIndex}`} tab={tab.name} href={`${TAB_URL}/${tab.path}`}>
                            {unseenNotificationCount > 0 && tab.name === 'notification' && (
                                <IonBadge color="danger">{unseenNotificationCount}</IonBadge>
                            )}
                            <IonIcon icon={active ? tab.activeIcon : tab.icon} />
                        </IonTabButton>
                    );
                })}
            </IonTabBar>
        </IonTabs>
    );
};

export default Tabs;

/* 
	Notes:
	- /tabs nên là hard-code, đừng dùng props.match, bị lỗi
*/
