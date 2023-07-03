import classNames from 'classnames';
import { FC } from 'react';
import tempImg from './../../assets/destinee-logo-square-black.png';
import styles from './FavoritesCmp.module.scss';

export interface FavoriteType {
    title: string;
    type: string;
    items: { thumbnail?: string | null; name: string }[];
}

type FavoriteTypeCmp = FavoriteType & {
    isReverse?: boolean;
};

const FavoritesCmp: FC<FavoriteTypeCmp> = function ({ title, type, items, isReverse }) {
    const favContainerClasses = classNames(styles.favContainer, {
        [styles.reverseContainer]: isReverse,
    });
    const favItemClasses = classNames(styles.favItem, {
        [styles.reverseItem]: isReverse,
    });

    return (
        <div className={favContainerClasses}>
            <h6>{title}</h6>
            {items.length > 0 && (
                <>
                    {items.map((item) => (
                        <div className={favItemClasses} key={item.name}>
                            <img
                                src={item.thumbnail === null ? tempImg : item.thumbnail}
                                alt={type}
                            />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </>
            )}
            {items.length <= 0 && type === 'song' && (
                <p className={styles.emptyLabel}>Chưa có dữ liệu...</p>
            )}
            {items.length <= 0 && type === 'movie' && (
                <p className={styles.emptyLabel}>Chưa có dữ liệu...</p>
            )}
        </div>
    );
};

export default FavoritesCmp;
