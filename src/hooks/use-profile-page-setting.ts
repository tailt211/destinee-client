import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FieldSection, ProfileCallSettingFields
} from '../components/info-setting/field-section/field-section.type';
import {
    DisplayNameUpdateFunction, fieldSectionProfilePageSetting,
    TogglerUpdateFunction
} from '../components/info-setting/field-section/field-sections';
import { DISPLAY_NAME_OPTION } from '../model/profile/profile.constant';
import { AppDispatch, RootState } from '../store';
import { ProfileState } from '../store/profile/profile.slice';
import { updateProfilePageSettingThunk } from '../store/profile/profile.thunk';

export default function useProfilePageSetting() {
    const dispatch: AppDispatch = useDispatch();
    const { _id, loading, profilePageSetting } = useSelector(
        (state: RootState) => state.profile,
    ) as ProfileState;

    /* Update Handler */
    const displayNameUpdateHandler: DisplayNameUpdateFunction = useCallback(
        (value) => {
            const updatedDisplayName = DISPLAY_NAME_OPTION[value as string];
            if (loading || updatedDisplayName === profilePageSetting.displayName) return;
            dispatch(
                updateProfilePageSettingThunk({
                    id: _id,
                    body: { displayName: updatedDisplayName },
                }),
            );
        },
        [dispatch, loading, _id, profilePageSetting.displayName],
    );

    const togglerUpdateHandler: TogglerUpdateFunction = useCallback(
        (fieldKey, value) => {
            if (loading || profilePageSetting[fieldKey] === (value as boolean)) return;
            if (typeof value === 'string' || typeof value === 'object')
                throw new Error(
                    "togglerUpdateHandler value can't be string or string array",
                );

            dispatch(
                updateProfilePageSettingThunk({ id: _id, body: { [fieldKey]: value } }),
            );
        },
        [dispatch, _id, loading, profilePageSetting],
    );

    /* Field Section */
    const profilePageSettingFieldSection = useMemo(
        () =>
            fieldSectionProfilePageSetting(
                displayNameUpdateHandler,
                togglerUpdateHandler,
                dispatch,
                {
                    _id: _id,
                    loading: loading,
                    displayName: profilePageSetting.displayName,
                    age: profilePageSetting.age,
                    height: profilePageSetting.height,
                    hobbies: profilePageSetting.hobbies,
                    jobStatus: profilePageSetting.jobStatus,
                    languages: profilePageSetting.languages,
                    origin: profilePageSetting.origin,
                    sex: profilePageSetting.sex,
                    bio: profilePageSetting.bio,
                },
            ),
        [displayNameUpdateHandler, togglerUpdateHandler, profilePageSetting, _id, loading, dispatch],
    );

    const fieldList: FieldSection<ProfileCallSettingFields>[] = useMemo(() => {
        return [profilePageSettingFieldSection];
    }, [profilePageSettingFieldSection]);

    return { fieldList };
}
