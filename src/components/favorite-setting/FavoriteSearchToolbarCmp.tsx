import { IonSearchbar, IonToolbar } from '@ionic/react';
import { FC } from 'react';
import TitleToolbarCmp from '../toolbar/TitleToolbarCmp';
import styles from './FavoriteSearchToolbarCmp.module.scss';

const FavoriteSearchToolbarCmp: FC<{
    title: string;
    searchPlaceholder: string;
    debounce: number;
    isDisabled: boolean;
    searchHandler: (search: string) => void;
}> = function ({ title, searchPlaceholder, debounce = 700, isDisabled = false, searchHandler }) {
    return (
        <>
            <TitleToolbarCmp title={title} />
            <IonToolbar className={styles.searchToolbar}>
                <IonSearchbar
                    onIonChange={(e) => searchHandler(e.detail.value!)}
                    showClearButton="focus"
                    placeholder={searchPlaceholder}
                    debounce={debounce}
                    color="white"
                    disabled={isDisabled}
                />
            </IonToolbar>
        </>
    );
};

export default FavoriteSearchToolbarCmp;
