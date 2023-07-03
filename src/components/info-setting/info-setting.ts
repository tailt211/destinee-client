import { FieldModalType, FormatterFieldValue } from "./field-section/field-section.helper";
import { FieldUpdate } from "./field-section/field-section.type";

export type InputModalHandler = (
    fieldName: string,
    fieldValue: FormatterFieldValue,
    type: FieldModalType,
    onUpdate: FieldUpdate,
) => void;