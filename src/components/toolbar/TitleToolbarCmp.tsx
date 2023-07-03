import { IonBackButton, IonButtons, IonTitle, IonToolbar } from '@ionic/react';
import classNames from 'classnames';
import { FC, Fragment } from 'react';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import styles from './TitleToolbarCmp.module.scss';

const TitleToolbarCmp: FC<{title: string; blackTheme?: boolean}> = function ({title, blackTheme = false}) {
	return (
		<Fragment>
			<IonToolbar className={classNames([styles.customToolbar, { [styles.blackTheme]: blackTheme }])}>
				<IonButtons slot="start">
					<IonBackButton text="" defaultHref={`${TAB_URL}/${PATHS.HOME}`} />
				</IonButtons>
				<IonTitle color={blackTheme ? 'black' : 'white'}>{title}</IonTitle>
			</IonToolbar>
		</Fragment>
	);
};

export default TitleToolbarCmp;
