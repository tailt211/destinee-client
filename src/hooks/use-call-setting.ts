import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ProfileCallSettingFields,
    FieldSection
} from '../components/info-setting/field-section/field-section.type';
import {
    DisplayNameUpdateFunction,
    fieldSectionCallInfoSetting,
    TogglerUpdateFunction
} from '../components/info-setting/field-section/field-sections';
import { DISPLAY_NAME_OPTION } from '../model/profile/profile.constant';
import { AppDispatch, RootState } from '../store';
import { ProfileState } from '../store/profile/profile.slice';
import { updateProfileCallSettingThunk } from '../store/profile/profile.thunk';

export default function useCallSetting() {
    const dispatch: AppDispatch = useDispatch();
    const { _id, loading, callSetting } = useSelector(
        (state: RootState) => state.profile,
    ) as ProfileState;

    /* Update Handler */
    const displayNameUpdateHandler: DisplayNameUpdateFunction = useCallback(
        (value) => {
            const updatedDisplayName = DISPLAY_NAME_OPTION[value as string];
            if (loading || updatedDisplayName === callSetting.displayName) return;
            dispatch(
                updateProfileCallSettingThunk({
                    id: _id,
                    body: { displayName: updatedDisplayName },
                }),
            );
        },
        [dispatch, loading, _id, callSetting.displayName],
    );

    const togglerUpdateHandler: TogglerUpdateFunction = useCallback(
        (fieldKey, value) => {
            if (loading || callSetting[fieldKey] === (value as boolean)) return;
            if (typeof value === 'string' || typeof value === 'object')
                throw new Error(
                    "togglerUpdateHandler value can't be string or string array",
                );

            dispatch(
                updateProfileCallSettingThunk({ id: _id, body: { [fieldKey]: value } }),
            );
        },
        [dispatch, _id, loading, callSetting],
    );

    /* Field Section */
    const callInfoSettingFieldSection = useMemo(
        () =>
            fieldSectionCallInfoSetting(displayNameUpdateHandler, togglerUpdateHandler, {
                displayName: callSetting.displayName,
                age: callSetting.age,
                height: callSetting.height,
                hobbies: callSetting.hobbies,
                jobStatus: callSetting.jobStatus,
                languages: callSetting.languages,
                origin: callSetting.origin,
                sex: callSetting.sex,
            }),
        [displayNameUpdateHandler, togglerUpdateHandler, callSetting],
    );

    const fieldList: FieldSection<ProfileCallSettingFields>[] = useMemo(() => {
        return [callInfoSettingFieldSection];
    }, [callInfoSettingFieldSection]);

    return { fieldList };
}
