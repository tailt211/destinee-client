import { isEmpty, isEqual, sortBy } from 'lodash';
import { TOPIC } from '../../../model/call/topic.enum';
import { FavoriteMovieDTO } from '../../../model/profile/dto/favorite-movie.dto';
import { FavoriteSongDTO } from '../../../model/profile/dto/favorite-song.dto';
import { DISPLAY_NAME_OPTION, GENDER, JOB, LANGUAGE, REGION, SEX } from '../../../model/profile/profile.constant';
import { QueueFilterDTO } from '../../../model/queue/dto/queue-filter.dto';
import { PATHS } from '../../../router/paths';
import { AppDispatch } from '../../../store';
import { updateProfilePageSettingThunk, updateProfileThunk } from '../../../store/profile/profile.thunk';
import { setFilter } from '../../../store/queue/queue.slice';
import { getDateOnly } from '../../../utils/formatter';
import {
    displayNameDisplayer,
    genderDisplayer,
    jobDisplayer,
    languageDisplayer,
    regionDisplayer,
    sexDisplayer,
    topicDisplayer,
} from './field-section-displayer';
import {
    FavoriteInformation,
    FieldSection,
    FieldUpdateValueParam,
    MandatoryInformation,
    OptionalInformation,
    ProfileCallSettingFields,
    ProfilePageSettingFields,
    QueueSetupFields,
} from './field-section.type';

export const fieldSectionMandatory: (
    dispatch: AppDispatch,
    state: {
        loading: boolean;
        profileId: string;
        name: string;
        nickname: string;
        username: string;
        origin: REGION;
        birthdate: Date;
        gender: GENDER;
        sex: SEX;
    },
) => FieldSection<MandatoryInformation> = (
    dispatch,
    { loading, profileId, name, nickname, username, origin, birthdate, gender, sex },
) => {
    return {
        sectionTitle: 'thông tin bắt buộc',
        fields: {
            name: {
                fieldName: 'tên',
                fieldValue: name,
                type: 'single',
                required: true,
                onUpdate: (value) => {
                    value = value as string;
                    if (value.trim() === name) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                name: value,
                            },
                        }),
                    );
                },
            },
            nickname: {
                fieldName: 'biệt danh',
                fieldValue: nickname,
                capitalize: 'first-word',
                type: 'single',
                required: true,
                onUpdate: (value) => {
                    value = value as string;
                    if (value.trim() === nickname) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                nickname: value as string,
                            },
                        }),
                    );
                },
            },
            username: {
                fieldName: 'tên tài khoản',
                fieldValue: username,
                type: 'single',
                required: true,
                onUpdate: (value) => {
                    value = value as string;
                    if (value.trim() === nickname) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                username: value,
                            },
                        }),
                    );
                },
            },
            origin: {
                fieldName: 'quê quán',
                fieldValue: origin,
                capitalize: 'all-word',
                type: 'options',
                options: regionDisplayer,
                onUpdate: (value) => {
                    value = value as string;
                    const updatedOrigin = REGION[value];
                    if (loading || updatedOrigin === origin) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                origin: updatedOrigin,
                            },
                        }),
                    );
                },
                required: true,
            },
            birthdate: {
                fieldName: 'ngày sinh',
                fieldValue: birthdate,
                type: 'date',
                required: true,
                onUpdate: (value) => {
                    value = value as string;
                    const trimedUpdateDate = getDateOnly(value);
                    const trimedLastDate = getDateOnly(birthdate);
                    if (loading || trimedLastDate.getTime() === trimedUpdateDate.getTime()) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                birthdate: trimedUpdateDate,
                            },
                        }),
                    );
                },
            },
            gender: {
                fieldName: 'giới tính',
                fieldValue: gender,
                capitalize: 'all-word',
                type: 'options',
                options: genderDisplayer,
                onUpdate: async (value) => {
                    value = value as string;
                    const isMale = GENDER[value] === GENDER.MALE ? true : false;
                    if (loading || GENDER[value] === gender) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                gender: isMale,
                            },
                        }),
                    );
                },
                required: true,
            },
            sex: {
                fieldName: 'bạn là',
                fieldValue: sex,
                capitalize: 'first-word',
                type: 'options',
                options: sexDisplayer,
                onUpdate: (value) => {
                    value = value as string;
                    const updatedSex = SEX[value];
                    if (loading || updatedSex === sex) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                sex: updatedSex,
                            },
                        }),
                    );
                },
                required: true,
            },
        },
    };
};

export const fieldSectionOptional: (
    dispatch: AppDispatch,
    state: {
        loading: boolean;
        profileId: string;
        job?: JOB;
        workAt?: string;
        major?: string;
        height?: number;
        languages?: LANGUAGE[];
    },
) => FieldSection<OptionalInformation> = (dispatch, { loading, profileId, job, workAt, major, height, languages }) => {
    return {
        sectionTitle: 'thông tin tuỳ thích',
        fields: {
            job: {
                fieldName: 'bạn đang là',
                fieldValue: job || 'NONE',
                capitalize: 'first-word',
                type: 'options',
                options: {
                    NONE: null,
                    ...jobDisplayer,
                },
                onUpdate: (value) => {
                    value = value as string;
                    const updatedJob = value === 'NONE' ? null : JOB[value];

                    if (loading || updatedJob === job) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                job: updatedJob,
                            },
                        }),
                    );
                },
            },
            workAt: {
                fieldName: 'trường / công ty',
                fieldValue: workAt,
                type: 'single',
                onUpdate: (value) => {
                    value = (value as string).trim();
                    if (loading || value === workAt) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                workAt: isEmpty(value) ? null : value,
                            },
                        }),
                    );
                },
            },
            major: {
                fieldName: 'chuyên ngành',
                fieldValue: major,
                type: 'single',
                onUpdate: (value) => {
                    value = (value as string).trim();
                    if (loading || value === major) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                major: isEmpty(value) ? null : value,
                            },
                        }),
                    );
                },
            },
            height: {
                fieldName: 'chiều cao',
                fieldValue: height,
                type: 'height',
                onUpdate: (value) => {
                    const updatedHeight = parseInt(value as string);
                    if (loading || updatedHeight === height) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                height: updatedHeight,
                            },
                        }),
                    );
                },
            },
            languages: {
                fieldName: 'ngôn ngữ',
                fieldValue: languages,
                options: languageDisplayer,
                onUpdate: (value) => {
                    value = value as string[];
                    const isNothingChange = isEqual(sortBy(value), sortBy(languages));
                    if (loading || isNothingChange) return;
                    dispatch(
                        updateProfileThunk({
                            id: profileId,
                            body: {
                                languages: value.map((lang) => LANGUAGE[lang]),
                            },
                        }),
                    );
                },
                capitalize: 'all-word',
                type: 'multi-options',
            },
        },
    };
};

export const fieldSectionFavorite: (
    history: {
        push(location: string): void;
        replace(location: string): void;
        go(n: number): void;
        goBack(): void;
    },
    state: {
        favoriteSongs: FavoriteSongDTO[];
        favoriteMovies: FavoriteMovieDTO[];
    },
) => FieldSection<FavoriteInformation> = (history, { favoriteSongs, favoriteMovies }) => {
    return {
        sectionTitle: 'sở thích',
        fields: {
            songs: {
                fieldName: '3 bài nhạc yêu thích nhất',
                fieldValue: favoriteSongs.map((s) => s.title),
                capitalize: 'all-word',
                type: 'custom',
                required: true,
                onUpdate: (value) => {
                    history.push(`/${PATHS.FAVORITE_SONG_SETTING}`);
                },
            },
            movies: {
                fieldName: '3 bộ phim yêu thích nhất',
                fieldValue: favoriteMovies.map((s) => s.title),
                capitalize: 'all-word',
                type: 'custom',
                required: true,
                onUpdate: (value) => {
                    history.push(`/${PATHS.FAVORITE_MOVIE_SETTING}`);
                },
            },
            hobbies: {
                fieldName: '3 sở thích',
                fieldValue: [],
                capitalize: 'all-word',
                type: 'custom',
                required: true,
                onUpdate: (value) => {
                    alert('Tính năng đang được phát triển');
                },
            },
        },
    };
};

export const fieldSectionProfilePageSetting: (
    displayNameUpdateHandler: DisplayNameUpdateFunction,
    togglerUpdateHandler: TogglerUpdateFunction,
    dispatch: AppDispatch,
    state: {
        _id: string;
        loading: boolean;
        displayName: DISPLAY_NAME_OPTION;
        age: boolean;
        height: boolean;
        origin: boolean;
        sex: boolean;
        jobStatus: boolean;
        languages: boolean;
        hobbies: boolean;
        bio?: string;
    },
) => FieldSection<ProfilePageSettingFields> = (
    displayNameUpdateHandler,
    togglerUpdateHandler,
    dispatch,
    { _id, loading, displayName, age, height, hobbies, jobStatus, languages, origin, sex, bio },
) => ({
    sectionTitle: 'thông tin cá nhân',
    showTogglerLabel: true,
    fields: {
        displayName: {
            fieldName: 'Tên / Biệt danh',
            fieldValue: displayName,
            type: 'options',
            options: displayNameDisplayer,
            onUpdate: displayNameUpdateHandler,
            capitalize: 'first-word',
            required: true,
        },
        age: {
            fieldName: 'tuổi',
            fieldValue: age,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'age'),
            required: true,
        },
        height: {
            fieldName: 'chiều cao',
            fieldValue: height,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'height'),
            required: true,
        },
        origin: {
            fieldName: 'quê quán',
            fieldValue: origin,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'origin'),
            required: true,
        },
        sex: {
            fieldName: 'xu hướng tính dục',
            fieldValue: sex,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'sex'),
            required: true,
        },
        jobStatus: {
            fieldName: 'công việc / trường',
            fieldValue: jobStatus,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'jobStatus'),
            required: true,
        },
        languages: {
            fieldName: 'ngôn ngữ',
            fieldValue: languages,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'languages'),
            required: true,
        },
        hobbies: {
            fieldName: 'sở thích',
            fieldValue: hobbies,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'hobbies'),
            required: true,
        },
        bio: {
            fieldName: 'bio (giới thiệu)',
            fieldValue: bio || '',
            type: 'text',
            onUpdate: (value) => {
                const updatedBio = (value as string).trim();
                if (loading || updatedBio === bio) return;
                dispatch(
                    updateProfilePageSettingThunk({
                        id: _id,
                        body: { bio: isEmpty(updatedBio) ? null : updatedBio },
                    }),
                );
            },
            required: false,
        },
    },
});

export type TogglerUpdateFunctionFieldKey = keyof Omit<ProfileCallSettingFields, 'displayName'>;
export type DisplayNameUpdateFunction = (value: FieldUpdateValueParam) => void;
export type TogglerUpdateFunction = (fieldKey: TogglerUpdateFunctionFieldKey, value: FieldUpdateValueParam) => void;
export const fieldSectionCallInfoSetting: (
    displayNameUpdateHandler: DisplayNameUpdateFunction,
    togglerUpdateHandler: TogglerUpdateFunction,
    state: {
        displayName: DISPLAY_NAME_OPTION;
        age: boolean;
        height: boolean;
        origin: boolean;
        sex: boolean;
        jobStatus: boolean;
        languages: boolean;
        hobbies: boolean;
    },
) => FieldSection<ProfileCallSettingFields> = (
    displayNameUpdateHandler,
    togglerUpdateHandler,
    { displayName, age, height, hobbies, jobStatus, languages, origin, sex },
) => ({
    sectionTitle: 'thông tin cá nhân',
    showTogglerLabel: true,
    fields: {
        displayName: {
            fieldName: 'Tên / Biệt danh',
            fieldValue: displayName,
            type: 'options',
            options: displayNameDisplayer,
            onUpdate: displayNameUpdateHandler,
            capitalize: 'first-word',
            required: true,
        },
        age: {
            fieldName: 'tuổi',
            fieldValue: age,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'age'),
            required: true,
        },
        height: {
            fieldName: 'chiều cao',
            fieldValue: height,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'height'),
            required: true,
        },
        origin: {
            fieldName: 'quê quán',
            fieldValue: origin,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'origin'),
            required: true,
        },
        sex: {
            fieldName: 'xu hướng tính dục',
            fieldValue: sex,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'sex'),
            required: true,
        },
        jobStatus: {
            fieldName: 'công việc / trường',
            fieldValue: jobStatus,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'jobStatus'),
            required: true,
        },
        languages: {
            fieldName: 'ngôn ngữ',
            fieldValue: languages,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'languages'),
            required: true,
        },
        hobbies: {
            fieldName: 'sở thích',
            fieldValue: hobbies,
            type: 'boolean',
            onUpdate: togglerUpdateHandler.bind(null, 'hobbies'),
            required: true,
        },
    },
});

export const fieldSectionQueueSetup: (dispatch: AppDispatch, state: QueueFilterDTO) => FieldSection<QueueSetupFields> = (
    dispatch,
    { gender, origin, ageRange, sex, topic, language },
) => {
    return {
        sectionTitle: 'lựa chọn tiêu chí',
        fields: {
            gender: {
                fieldName: 'giới tính',
                fieldValue: gender,
                capitalize: 'all-word',
                type: 'options',
                options: genderDisplayer,
                onUpdate: async (value) => {
                    value = value as string;
                    const updatedGender = GENDER[value];
                    if (updatedGender === gender) return;
                    dispatch(setFilter({ gender: updatedGender }));
                },
                required: true,
            },
            origin: {
                fieldName: 'quê quán',
                fieldValue: origin,
                capitalize: 'all-word',
                type: 'options',
                options: {
                    NONE: null,
                    ...regionDisplayer,
                },
                onUpdate: (value) => {
                    value = value as string;
                    const updatedOrigin = value === 'NONE' ? null : REGION[value];
                    if (updatedOrigin === origin) return;
                    dispatch(setFilter({ origin: updatedOrigin }));
                },
            },
            ageRange: {
                fieldName: 'độ tuổi',
                fieldValue: ageRange,
                type: 'range',
                onUpdate: (value) => {
                    value = value as [number, number];
                    if (isEqual(value, ageRange)) return;
                    dispatch(setFilter({ ageRange: value }));
                },
                required: false,
            },
            topic: {
                fieldName: 'Chủ đề',
                fieldValue: topic,
                capitalize: 'all-word',
                type: 'options',
                options: {
                    NONE: null,
                    ...topicDisplayer,
                },
                onUpdate: (value) => {
                    value = value as string;
                    const updatedTopic = value === 'NONE' ? null : TOPIC[value];
                    if (updatedTopic === topic) return;
                    dispatch(setFilter({ topic: updatedTopic }));
                },
            },
            language: {
                fieldName: 'Ngôn ngữ',
                fieldValue: language,
                capitalize: 'all-word',
                type: 'options',
                options: {
                    NONE: null,
                    ...languageDisplayer,
                },
                onUpdate: (value) => {
                    value = value as string;
                    const updatedLang = value === 'NONE' ? null : LANGUAGE[value];
                    if (updatedLang === language) return;
                    dispatch(setFilter({ language: updatedLang }));
                },
            },
            sex: {
                fieldName: 'Xu hướng tính dục',
                fieldValue: sex,
                capitalize: 'all-word',
                type: 'options',
                options: {
                    NONE: null,
                    ...sexDisplayer,
                },
                onUpdate: (value) => {
                    value = value as string;
                    const updatedSex = value === 'NONE' ? null : SEX[value];
                    if (updatedSex === sex) return;
                    dispatch(setFilter({ sex: updatedSex }));
                },
            },
        },
    };
};
