import {
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToggle,
} from '@ionic/react';
import classNames from 'classnames';
import _, { isArray } from 'lodash';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ProfileState } from '../../store/profile/profile.slice';
import {
    capitalizeValue,
    fieldValueDisplayer,
} from './field-section/field-section.helper';
import {
    Field,
    FieldCapitalizeOptions,
    FieldOptions,
    FieldType,
    FieldValue,
} from './field-section/field-section.type';
import { InputModalHandler } from './info-setting';
import styles from './InfoSettingFieldCmp.module.scss';

type InfoSettingFieldCmpProps = Field<FieldValue> & {
    openInputModalHandler: InputModalHandler;
};

const InfoSettingFieldCmp: FC<InfoSettingFieldCmpProps> = function ({
    fieldName,
    fieldValue,
    type,
    options,
    capitalize,
    openInputModalHandler,
    onUpdate,
}) {
    const { loading } = useSelector(
        (state: RootState) => state.profile,
    ) as ProfileState;

    const fieldValueRenderer = function (
        fieldValue: FieldValue,
        type: FieldType,
        onUpdate: (value: string | boolean) => void,
        options?: FieldOptions,
        capitalize?: FieldCapitalizeOptions,
    ) {
        if (type === 'boolean' && !onUpdate)
            throw new Error(
                `onUpdate can't be null when renderType is [boolean] (field: ${fieldValue})`,
            );
        if (type === 'boolean' && typeof fieldValue === 'boolean' && onUpdate)
            return (
                <IonToggle
                    slot="end"
                    mode="md"
                    color="green"
                    checked={fieldValue}
                    onIonChange={(e) => onUpdate(e.detail.checked)}
                />
            );
        if (type === 'text' && !onUpdate)
            throw new Error(
                `onUpdate can't be null when renderType is [text] (field: ${fieldValue})`,
            );
        if (type === 'text' && onUpdate)
            return (
                <IonTextarea
                    rows={6}
                    placeholder="Điền thông tin ở đây..."
                    value={fieldValue as string}
                    onIonBlur={(e: CustomEvent<FocusEvent>) =>
                        onUpdate((e.detail.target as HTMLTextAreaElement).value)
                    }></IonTextarea>
            );
        if (type === 'options' && (!options || !onUpdate))
            throw new Error(
                `Options, onUpdate can't be null when renderType is [options] (field: ${fieldValue})`,
            );
        if ((type === 'options' || type === 'multi-options') && options && onUpdate) {
            return (
                <IonSelect
                    value={fieldValue}
                    onIonChange={(e) => onUpdate(e.detail.value)}
                    multiple={type === 'multi-options'}
                    color="teal">
                    {Object.entries(options).map(([key, title]) => (
                        <IonSelectOption value={key} key={key}>
                            {capitalizeValue(title, capitalize)}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            );
        }
        if (
            (type === 'single' || type === 'date' || type === 'height' || type === 'range' || (type === 'custom' && isArray(fieldValue))) &&
            typeof fieldValue !== 'boolean'
        )
            return (
                <IonLabel
                    className={classNames([
                        'text-right',
                        'font-normal',
                    ])}>
                    {fieldValueDisplayer(fieldValue, type, options, fieldName)}
                </IonLabel>
            );

        // throw new Error(
        // 	`Error happen when try to render setting fields (field: ${fieldValue})`
        // );
    };

    const SINGLE_FIELD_CONDITION =
        type === 'single' || type === 'date' || type === 'height' || type === 'range';

    const isItemButton = SINGLE_FIELD_CONDITION || type === 'custom';
    const itemPosition = type === 'text' ? 'stacked' : undefined;

    let onClickHandler: any = () => {};
    if(SINGLE_FIELD_CONDITION && typeof fieldValue !== 'boolean') onClickHandler = openInputModalHandler.bind(null, fieldName, fieldValue, type, onUpdate);
    if(type === 'custom') onClickHandler = onUpdate;

    return (
        <div className={styles.field}>
            <IonItem button={isItemButton} onClick={onClickHandler} disabled={loading}>
                <IonLabel position={itemPosition}>{_.capitalize(fieldName)}</IonLabel>
                {fieldValueRenderer(fieldValue, type, onUpdate, options, capitalize)}
            </IonItem>
        </div>
    );
};

export default InfoSettingFieldCmp;
