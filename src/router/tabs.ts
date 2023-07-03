import {
	call,
	callOutline,
	chatbubble,
	chatbubbleOutline,
	home,
	homeOutline,
	notifications,
	notificationsOutline,
	people,
	peopleOutline,
} from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import CallHistoryPage from '../pages/tab/CallHistoryPage';
import FriendPage from '../pages/tab/FriendPage';
import HomePage from '../pages/tab/HomePage';
import NotificationPage from '../pages/tab/NotificationPage';
import { PATHS } from './paths';
import MessagePage from '../pages/tab/MessagePage';

export const TAB_URL = '/tabs';

export interface RouteTab {
	name: string;
	path: string;
	activeIcon: string;
	icon: string;
	component: React.FC<{} & RouteComponentProps>;
}

const tabs: RouteTab[] = [
	{
		name: 'call-history',
		path: PATHS.CALL_HISTORY,
		activeIcon: call,
		icon: callOutline,
		component: CallHistoryPage,
	},
	{
		name: 'message',
		path: PATHS.MESSAGE,
		activeIcon: chatbubble,
		icon: chatbubbleOutline,
		component: MessagePage,
	},
	{
		name: 'home',
		path: PATHS.HOME,
		activeIcon: home,
		icon: homeOutline,
		component: HomePage,
	},
	{
		name: 'notification',
		path: PATHS.NOTIFICATION,
		activeIcon: notifications,
		icon: notificationsOutline,
		component: NotificationPage,
	},
	{
		name: 'friend',
		path: PATHS.FRIEND,
		activeIcon: people,
		icon: peopleOutline,
		component: FriendPage,
	},
];

export const defaultTab: RouteTab = tabs.filter((t) => t.name === 'home')[0];

export default tabs;
