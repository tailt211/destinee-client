import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
    FavoriteInformation,
    FieldSection,
    MandatoryInformation,
    OptionalInformation,
} from '../components/info-setting/field-section/field-section.type';
import {
    fieldSectionFavorite,
    fieldSectionMandatory,
    fieldSectionOptional,
} from '../components/info-setting/field-section/field-sections';
import { AppDispatch, RootState } from '../store';
import { ProfileState } from '../store/profile/profile.slice';

export default function usePersonalSetting() {
    const dispatch: AppDispatch = useDispatch();
    const { loading, _id, name, nickname, username, personalInfo } = useSelector(
        (state: RootState) => state.profile,
    ) as ProfileState;
    const history = useHistory();

    const fieldList: FieldSection<
        MandatoryInformation | OptionalInformation | FavoriteInformation
    >[] = useMemo(() => {
        return [
            fieldSectionMandatory(dispatch, {
                loading,
                profileId: _id,
                name,
                nickname,
                username: username,
                birthdate: new Date(Date.parse(personalInfo.birthdate)),
                gender: personalInfo.gender,
                origin: personalInfo.origin,
                sex: personalInfo.sex,
            }),
            fieldSectionOptional(dispatch, {
                loading,
                profileId: _id,
                major: personalInfo.major,
                job: personalInfo.job,
                workAt: personalInfo.workAt,
                height: personalInfo.height,
                languages: personalInfo.languages,
            }),
            fieldSectionFavorite(history, {
                favoriteSongs: personalInfo.favoriteSongs || [],
                favoriteMovies: personalInfo.favoriteMovies || [],
            }),
        ];
    }, [
        dispatch,
        history,
        loading,
        _id,
        name,
        nickname,
        username,
        personalInfo.birthdate,
        personalInfo.gender,
        personalInfo.origin,
        personalInfo.sex,
        personalInfo.major,
        personalInfo.job,
        personalInfo.workAt,
        personalInfo.height,
        personalInfo.languages,
        personalInfo.favoriteSongs,
        personalInfo.favoriteMovies,
    ]);

    return fieldList;
}
