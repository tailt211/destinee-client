import classNames from 'classnames';
import React from 'react';
import styles from './CardSuggestionCmp.module.scss';

const CardSuggestionCmp: React.FC<{
    textSuggest: string;
    onCardClick: () => void;
    highlight: boolean;
}> = ({ textSuggest, onCardClick, highlight }) => {
    const cardSuggest = classNames([styles.cardSuggest], {
        [styles.highlight]: highlight,
    });

    return (
        <div className={cardSuggest} onClick={onCardClick}>
            <p>{textSuggest}</p>
        </div>
    );
};

export default CardSuggestionCmp;
