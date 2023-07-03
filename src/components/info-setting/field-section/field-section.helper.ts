import split from 'lodash/split';
import capitalize from 'lodash/capitalize';
import { Field, FieldCapitalizeOptions, FieldOptions, FieldValue } from './field-section.type';
import moment from 'moment';

export type FormatterFieldValue = Exclude<FieldValue, ConstrainBoolean>;
export type FormatterField = Exclude<Field<FormatterFieldValue>, 'type'>;
export type FieldModalType = 'single' | 'options' | 'multi-options' | 'date' | 'custom' | 'height' | 'range';

export const fieldValueStringConverter = (value: FormatterFieldValue): string => {
	const isArr = Array.isArray(value);
	const isDate = value instanceof Date;
	const isNull = !value;
	const isSingle = typeof value === 'number' || typeof value === 'string';
	if (isNull) return 'Trống';
	if (isSingle) return value.toString();
	if (isDate) return moment(value).format('DD/MM/YYYY');
	if (isArr && value.length === 0) return 'Trống';
	// if (isArr) return value.map(v => 
	// 	v.split(' ').map(s => 
	// 		s.slice(0, 1).toUpperCase() + s.slice(1, s.length)).join(' ')).join(', '); // toUpperCase
	if (isArr) return value.map(v => capitalize(`${v}`)).join(', '); //capitalize
	return '';
};

export const fieldValueDisplayer = function (
	fieldValue: Exclude<FieldValue, boolean>,
	type: FieldModalType,
	options?: FieldOptions,
	fieldName?: string,
) {
	if (type === 'custom') return fieldValueStringConverter(fieldValue);
    if (type === 'range' && Array.isArray(fieldValue)) return `${fieldValue[0]} - ${fieldValue[1]} tuổi`;
    if (type === 'options' && !!options && typeof fieldValue === 'string') {
        const key = options[fieldValue];
        if (!key) console.error("Can't find any key in options");
        return fieldValueStringConverter(key);
    }
    if (type === 'multi-options' && !!options && Array.isArray(fieldValue)) {
        let keys: string[] | null = fieldValue
            .map((value) => options[value])
            .filter((fieldValue) => fieldValue && fieldValue) as string[];
        keys = keys?.length === 0 ? null : keys;
        return fieldValueStringConverter(keys);
    }
    let displayerText = fieldValueStringConverter(fieldValue);
    if (fieldName === 'chiều cao' && !!fieldValue) displayerText += ' cm';

    return displayerText;
};

export const capitalizeValue = (
	value: string | number | null,
	capitalizeOptions?: FieldCapitalizeOptions
) =>
	capitalizeOptions
		? capitalizeOptions === 'all-word'
			? split(fieldValueStringConverter(value), ' ')
					.map((w) => capitalize(w))
					.join(' ')
			: capitalize(fieldValueStringConverter(value))
		: value;
