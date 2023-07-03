import classNames from 'classnames';
import { FC } from 'react';
import styles from './HobbiesCmp.module.scss';

const COLORS: string[] = ['#B5838D', '#43B794', '#3AAFA9'];

const HobbiesCmp: FC<{
    hobbies: string[];
    color?: string;
    isReverseLayout?: boolean;
}> = function ({ hobbies, color, isReverseLayout }) {
    const hobbiesClasses = classNames(styles.hobbies, {
        [styles.reverse]: isReverseLayout,
    });

    return (
        <div className={hobbiesClasses}>
            {hobbies.map((hobby, index) => (
                <div
                    className={`${styles.chip}`}
                    style={{ backgroundColor: COLORS[index % 5], color: color }}
                    key={hobby}
                >
                    {hobby}
                </div>
            ))}
        </div>
    );
};

export default HobbiesCmp;
