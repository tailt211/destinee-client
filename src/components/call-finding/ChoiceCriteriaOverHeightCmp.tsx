import { IonButton, IonIcon } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { QueueFilterDTO } from '../../model/queue/dto/queue-filter.dto';
import ModalContainerCmp from '../container/ModalContainerCmp';
import {
    genderDisplayer,
    languageDisplayer,
    regionDisplayer,
    sexDisplayer,
    topicDisplayer,
} from '../info-setting/field-section/field-section-displayer';
import styles from './ChoiceCriteriaOverHeightCmp.module.scss';

const ANY_CRITERIA = '_';

const ChoiceCriteriaOverHeightCmp: React.FC<{ filter: QueueFilterDTO }> = ({ filter }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const openCriteriaHandler = () => {
        setIsOpen(true);
    };

    return (
        <>
            <ModalContainerCmp open={isOpen} onClose={() => setIsOpen(false)}>
                <div className={styles.popContainer}>
                    <div className={styles.popHidden}>
                        <b>Tiêu chí lựa chọn</b>
                        <div className={styles.popHiddenContent}>
                            <div className={styles.content}>
                                <div className={styles.col}>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Giới tính: </span>
                                        <span className={styles.value}>{genderDisplayer[filter.gender]}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Quê quán: </span>
                                        <span className={styles.value}>
                                            {filter.origin ? regionDisplayer[filter.origin] : ANY_CRITERIA}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Độ Tuổi: </span>
                                        <span className={styles.value}>
                                            {filter.ageRange[0]} - {filter.ageRange[1]} tuổi
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.col}>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Chủ đề: </span>
                                        <span className={styles.value}>
                                            {filter.topic ? topicDisplayer[filter.topic] : ANY_CRITERIA}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Ngôn ngữ: </span>
                                        <span className={styles.value}>
                                            {filter.language ? languageDisplayer[filter.language] : ANY_CRITERIA}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Xu hướng tính dục: </span>
                                        <span className={styles.value}>
                                            {filter.sex ? sexDisplayer[filter.sex] : ANY_CRITERIA}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="opacity-0 absolute bottom-0" />
                    </div>
                </div>
            </ModalContainerCmp>
            <div className={styles.overHeightButtonDiv}>
                <IonButton
                    expand="block"
                    id="trigger-button"
                    className={styles.overHeightButton}
                    onClick={openCriteriaHandler}
                    fill="clear">
                    Tiêu chí lựa chọn
                    <IonIcon icon={informationCircleOutline} className={styles.iconInformations} />
                </IonButton>
            </div>
        </>
    );
};

export default ChoiceCriteriaOverHeightCmp;
