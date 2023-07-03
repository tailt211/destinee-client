import { split, capitalize as _capitalize } from 'lodash';
import { FieldCapitalizeOptions } from '../components/info-setting/field-section/field-section.type';

export const capitalizeValue = (value: string, capitalize?: FieldCapitalizeOptions) =>
    capitalize
        ? capitalize === 'all-word'
            ? split(value, ' ')
                  .map((w) => _capitalize(w))
                  .join(' ')
            : _capitalize(value)
        : value;
