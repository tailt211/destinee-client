import { IonContent } from '@ionic/react';
import classNames from 'classnames';
import { FC } from 'react';
import styles from './PageContentCmp.module.scss';
import { use100vh } from 'react-div-100vh'

const PageContentCmp: FC<{ title?: string; scrollY?: boolean; tabOffset?: boolean, customStyle?: {} }> = function (
	props
) {
	const { title, scrollY = false, tabOffset = false, customStyle = {} } = props;
	const height = use100vh();
    const suitableHeight = tabOffset ? height! - 128 : height! - 70;
	return (
        <IonContent
            fullscreen={false}
            scrollY={scrollY}
            scrollX={false}
            className={classNames([
                styles.customContent,
                { [styles.tabOffset]: tabOffset },
            ])}>
            <div
                className={classNames(styles.contentContainer, 'hide-scroll')}
                style={{
                    height: suitableHeight,
                    ...customStyle,
                }}>
                {title && <h1 className={styles.heading}>{title}</h1>}
                {props.children}
            </div>
        </IonContent>
    );
};

export default PageContentCmp;
