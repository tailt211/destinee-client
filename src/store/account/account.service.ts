import { destineeApi } from '../../https';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { PACKAGE } from '../../model/account/packages.enum';
import { AccountRESP } from '../../model/account/response/account.response';

export const fetchMyAccount = async () => {
    try {
        const { data } = await destineeApi.get<AccountRESP>(`/accounts/my-account`);
        return {
            id: data._id,
            profileId: data.profile,
            role: data.role,
            uid: data.uid,
            disabled: data.disabled,
            upgrade: data.upgrade ? {
                package: PACKAGE[data.upgrade.package],
                expiresDate: data.upgrade.expiresDate,
            } : undefined,
        } as AccountDTO;
    } catch (err) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải tài khoản');
    }
};
