import { DISPLAY_NAME_OPTION } from "../../../model/profile/profile.constant";

export interface MandatoryInformation {
    name: Field<string>;
    nickname: Field<string>;
    username: Field<string>;
    origin: Field<string>;
    birthdate: Field<Date>;
    gender: Field<string>;
    sex: Field<string>;
}

export interface OptionalInformation {
    job: Field<string | null | undefined>;
    workAt: Field<string | null | undefined>;
    major: Field<string | null | undefined>;
    height: Field<number | null | undefined>;
    languages: Field<string[] | null | undefined>;
}

export interface FavoriteInformation {
    songs: Field<string[] | null | undefined>;
    movies: Field<string[] | null | undefined>;
    hobbies: Field<string[] | null | undefined>;
}

export interface ProfilePageSettingFields {
    displayName: Field<DISPLAY_NAME_OPTION>;
    age: Field<boolean>;
    sex: Field<boolean>;
    origin: Field<boolean>;
    jobStatus: Field<boolean>;
    height: Field<boolean>;
    languages: Field<boolean>;
    hobbies: Field<boolean>;
    bio?: Field<string>;
}

export interface ProfileCallSettingFields {
    displayName: Field<DISPLAY_NAME_OPTION>;
    age: Field<boolean>;
    sex: Field<boolean>;
    origin: Field<boolean>;
    jobStatus: Field<boolean>;
    height: Field<boolean>;
    languages: Field<boolean>;
    hobbies: Field<boolean>;
}

export interface QueueSetupFields {
    gender: Field<string | null | undefined>;
    origin: Field<string | null | undefined>;
    ageRange: Field<[number, number]>;
    sex: Field<string | null | undefined>;
    topic: Field<string | null | undefined>;
    language: Field<string | null | undefined>;
}

export type AllSections =
    | MandatoryInformation
    | OptionalInformation
    | FavoriteInformation
    | QueueSetupFields
    | ProfilePageSettingFields;
export type FieldValue =
    | string
    | string[]
    | number
    | Date
    | [number, number]
    | null
    | undefined
    | boolean;
export type FieldType =
    | 'single'
    | 'text'
    | 'range'
    | 'options'
    | 'multi-options'
    | 'date'
    | 'boolean'
    | 'custom'
    | 'height';
export type FieldUpdateValueParam = string | boolean | string[] | [number, number];
export type FieldCapitalizeOptions = 'all-word' | 'first-word';
export type FieldOptions = { [key: string]: string | null };

export type FieldUpdate = (value: FieldUpdateValueParam) => void;
export interface Field<T> {
    fieldName: string;
    fieldValue: T;
    capitalize?: FieldCapitalizeOptions;
    type: FieldType;
    options?: FieldOptions;
    required?: boolean;
    onUpdate: FieldUpdate;
}

export interface FieldSection<T> {
    sectionTitle: string;
    showTogglerLabel?: boolean;
    fields: T;
}