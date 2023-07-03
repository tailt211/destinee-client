import React from 'react';
import { ChipItem } from './chip-item';
import styles from './PersonalityChipCmp.module.scss';

const PersonalityChipCmp: React.FC<{
    chip: ChipItem;
    active: boolean;
    onChipSelected: (chip: ChipItem) => void;
}> = ({
    chip,
    active,
    onChipSelected,
}) => {
    const clickHandler = () => {
        onChipSelected(chip);
    };

    return (
        <p
            className={styles.chip}
            onClick={clickHandler}
            style={{
                backgroundColor: active ? (chip.activeColor || 'var(--ion-color-green)') : 'white',
                border: !active ? `2px solid ${chip.baseColor}` : undefined,
                padding: !active ? `0px 4px` : '2px 6px',
            }}>
            {chip.displayer}
        </p>
    );
};

export default PersonalityChipCmp;
