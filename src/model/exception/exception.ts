export const EXCEPTION = {
    DUPLICATE_KEY_EXCEPTION: 'DuplicateKeyException',
    NOT_ACCEPTABLE_EXCEPTION: 'NotAcceptableException',
    CONFLICT_EXCEPTION: 'ConflictException',
    FORBIDDEN_EXCEPTION: 'ForbiddenException',
};

export class DuplicateKeyException extends Error {
    constructor(private entityName: string, keys: { [prop: string]: string }[]) {
        let msg = '';
        for (const [key, value] of Object.entries(keys)) {
            if (!key) continue;
            msg += `${key}: '${value}' `;
        }
        super(
            `Đã tồn tại ${msg.trim()} trong hệ thống và không được sử dụng lại giá trị này`,
        );
    }
}

export class NotAcceptableException extends Error {
    constructor(errors: string[]) {
        super(errors.join(', '));
    }
}

export class ConflictException extends Error {}

export class FobbidenException extends Error {}
