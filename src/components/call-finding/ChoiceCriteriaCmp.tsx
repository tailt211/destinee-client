import React from 'react';
import { QueueFilterDTO } from '../../model/queue/dto/queue-filter.dto';
import {
    genderDisplayer,
    languageDisplayer,
    regionDisplayer,
    sexDisplayer,
    topicDisplayer,
} from '../info-setting/field-section/field-section-displayer';
import styles from './ChoiceCriteriaCmp.module.scss';

const ANY_CRITERIA = '_';

const ChoiceCriteria: React.FC<{ displayTitle?: boolean; filter: QueueFilterDTO }> = ({ displayTitle = true, filter }) => {
    return (
        <div className={styles.container}>
            {displayTitle && <p className={styles.choiceTitle}>Tiêu chí lựa chọn</p>}
            <div className={styles.contentContainer}>
                <div className={styles.col}>
                    <div className={styles.row}>
                        <span className={styles.label}>Giới tính: </span>
                        <span className={styles.value}>{genderDisplayer[filter.gender]}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Quê quán: </span>
                        <span className={styles.value}>{filter.origin ? regionDisplayer[filter.origin] : ANY_CRITERIA}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Độ Tuổi: </span>
                        <span className={styles.value}>{filter.ageRange[0]} - {filter.ageRange[1]} tuổi</span>
                    </div>
                </div>
                <div className={styles.flexBoxInnerColumn}>
                    <div className={styles.row}>
                        <span className={styles.label}>Chủ đề: </span>
                        <span className={styles.value}>{filter.topic ? topicDisplayer[filter.topic] : ANY_CRITERIA}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Ngôn ngữ: </span>
                        <span className={styles.value}>{filter.language ? languageDisplayer[filter.language] : ANY_CRITERIA}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Xu hướng tính dục: </span>
                        <span className={styles.value}>{filter.sex ? sexDisplayer[filter.sex] : ANY_CRITERIA}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoiceCriteria;
