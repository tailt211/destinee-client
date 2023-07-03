import {
    IonLabel,
    IonList,
    IonListHeader,
    useIonModal,
    useIonPicker
} from '@ionic/react';
import { capitalize, range } from 'lodash';
import { FC, useState } from 'react';
import DateTimeModalCmp from '../../pages/profile/DateTimeModalCmp';
import ModalContainerCmp from '../container/ModalContainerCmp';
import { fieldValueStringConverter } from './field-section/field-section.helper';
import {
    AllSections,
    FieldSection,
    FieldUpdate
} from './field-section/field-section.type';
import { InputModalHandler } from './info-setting';
import styles from './InfoSettingCmp.module.scss';
import InfoSettingFieldCmp from './InfoSettingFieldCmp';
import InfoSettingInputModalCmp from './InfoSettingInputModalCmp';
import InfoSettingRangeModalCmp from './InfoSettingRangeModalCmp';

type InfoSettingCmpProps = {
    fieldList: FieldSection<AllSections>[];
};
const InfoSettingCmp: FC<InfoSettingCmpProps> = function ({ fieldList }) {
    const [openInputModal, setOpenInputModal] = useState(false);
    const [openRangeModal, setOpenRangeModal] = useState(false);
    const [inputName, setInputName] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const [rangeValue, setRangeValue] = useState<[number, number]>([0, 0]);
    const [inputDateValue, setInputDateValue] = useState<Date>(new Date());
    const [updateCallback, setUpdateCallback] = useState<FieldUpdate>(() => {});

    const [presentPicker] = useIonPicker();
    const [presentBirthdayModal] = useIonModal(DateTimeModalCmp, {
        title: capitalize(inputName),
        prevDate: inputDateValue,
        onUpdate(date: string) {
            updateCallback(date);
        },
    });

    /* Handler */
    const inputModalSaveHandler = (value: string | undefined | null) => {
        updateCallback(value as string);
        setInputName('');
        setInputValue('');
        setOpenInputModal(false);
    };

    const rangeModalSaveHandler = (value: [number, number]) => {
        updateCallback(value);
        setInputName('');
        setRangeValue([0, 0]);
        setOpenRangeModal(false);
    };

    const modalCloseHandler = (open: boolean) => {
        /* Always call twice */
        setUpdateCallback(() => {});
        setInputName('');
        setInputValue('');
        setRangeValue([0, 0]);
        setOpenInputModal(open);
        setOpenRangeModal(open);
    };

    const openInputModalHandler: InputModalHandler = (
        fieldName,
        fieldValue,
        type,
        onUpdate,
    ) => {
        setUpdateCallback(() => onUpdate);

        if (type === 'single') {
            setInputName(fieldName);
            setInputValue(!fieldValue ? '' : fieldValueStringConverter(fieldValue));
            setOpenInputModal(true);
        } else if (type === 'date') {
            setInputName(fieldName);
            setInputDateValue(!fieldValue ? new Date() : (fieldValue as Date));
            presentBirthdayModal({
                cssClass: 'customModal',
            });
        } else if(type === 'range') {
            setInputName(fieldName);
            setRangeValue(fieldValue as [number, number]);
            setOpenRangeModal(true);
        } else if (type === 'height') {
            presentPicker(
                [
                    {
                        name: 'centemeter',
                        options: range(120, 230, 1).map((count) => ({
                            text: `${count} cm`,
                            value: count.toString(),
                        })),
                        prefix: 'Chiều cao',
                        selectedIndex: (fieldValue as number) - 120, // minus min để lấy index
                    },
                ],
                [
                    {
                        text: 'Lưu',
                        handler: (selected) => {
                            onUpdate(selected.centemeter.value);
                        },
                    },
                ],
            );
        }
    };
    return (
        <div className={styles.infoSetting}>
            <ModalContainerCmp
                dialogPanelClasses="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full"
                open={openInputModal || openRangeModal}
                onClose={modalCloseHandler}>
                {openInputModal && <InfoSettingInputModalCmp
                    inputName={inputName}
                    inputValue={inputValue}
                    onSave={inputModalSaveHandler}
                />}
                {openRangeModal && <InfoSettingRangeModalCmp
                    inputName={inputName}
                    inputValue={rangeValue}
                    min={parseInt(process.env.REACT_APP_PROFILE_MIN_AGE!)}
                    max={parseInt(process.env.REACT_APP_PROFILE_MAX_AGE!)}
                    onSave={rangeModalSaveHandler}
                />}
            </ModalContainerCmp>
            {fieldList.map((section) => (
                <IonList lines="none" key={section.sectionTitle}>
                    <IonListHeader>
                        <IonLabel className="capitalizeFirstLetter">
                            {section.sectionTitle}
                        </IonLabel>
                        {section.showTogglerLabel && (
                            <IonLabel className="text-right">Hiển thị / Ẩn</IonLabel>
                        )}
                    </IonListHeader>
                    {Object.entries(section.fields).map(([key, field]) => (
                        <InfoSettingFieldCmp
                            key={key}
                            fieldName={field.fieldName}
                            fieldValue={field.fieldValue}
                            type={field.type}
                            options={field.options}
                            capitalize={field.capitalize}
                            required={field.required}
                            onUpdate={field.onUpdate}
                            openInputModalHandler={openInputModalHandler}
                        />
                    ))}
                </IonList>
            ))}
        </div>
    );
};

export default InfoSettingCmp;
