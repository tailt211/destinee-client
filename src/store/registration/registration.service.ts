import { isUndefined } from "lodash";
import { destineeApi } from "../../https";
import { httpExceptionConverter } from "../../model/exception/http-exception.converter";
import { GENDER, JOB, LANGUAGE, REGION, SEX } from "../../model/profile/profile.constant";
import { RegistrationAnswerDTO } from "../../model/registration/dto/registration-answer.dto";
import { RegistrationRegisterREQ } from "../../model/registration/request/registration-register.request";
import { RegistrationSubmitREQ } from "../../model/registration/request/registration-submit.request";
import { RegistrationImageUploadRESP } from "../../model/registration/response/registration-image-upload.response";
import { RegistrationOverallRESP } from "../../model/registration/response/registration-overall.response";
import { RegistrationRESP } from "../../model/registration/response/registration.response";

export const fetchRegistration = async () => {
    try {
        const data = (await destineeApi.get<RegistrationRESP>(`/register`))
            .data;
        return {
            answer: {
                name: data.name,
                nickname: data.nickname,
                birthdate: data.birthdate,
                gender: !isUndefined(data.gender) ? (data.gender ? GENDER.MALE : GENDER.FEMALE) : undefined,
                origin: data.origin ? REGION[data.origin] : undefined,
                sex: data.sex ? SEX[data.sex] : undefined,
                avatar: data.avatar,
                height: data.height,
                languages: data.languages === null ?  null : data.languages ? data.languages.map(lang => LANGUAGE[lang]) : undefined,
                hobbies: data.hobbies === null ?  null : data.hobbies ? data.hobbies : undefined,
                job: data.job === null ? null : data.job ? JOB[data.job] : undefined,
                major: data.major,
                workAt: data.workAt,
            } as RegistrationAnswerDTO,
            isFinished: data.isFinished,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi tải chi tiết bài trắc nghiệm tính cách',
        );
    }
};

export const submitAnswer = async (uid: string, body: RegistrationSubmitREQ) => {
    try {
        const { data } = await destineeApi.patch<RegistrationOverallRESP>(`/register/${uid}`, { [body.answerKey]: body.value });
        return data;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi đăng ký thông tin tài khoản',
        );
    }
};

export const uploadRegistrationAvatar = async (uid: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const { data } = await destineeApi.post<RegistrationImageUploadRESP>(`/register/${uid}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải ảnh đại diện');
    }
};

export const register = async (body: RegistrationRegisterREQ) => {
    try {
        return await (await destineeApi.post<RegistrationOverallRESP>(`/register`, body)).data;
    } catch (err: any) {
        console.error(err);
        const firebaseErrorCode = err.response?.data?.response?.detail?.code;
        const firebaseErrorMsg = err.response?.data?.response?.detail?.message;
        if(firebaseErrorCode && firebaseErrorCode === 'auth/invalid-email')
            throw new Error('Email không hợp lệ');
        if(firebaseErrorCode && firebaseErrorCode === 'auth/email-already-exists')
            throw new Error('Email đã tồn tại');
        if(firebaseErrorCode && firebaseErrorCode === 'auth/internal-error')
        throw new Error(firebaseErrorMsg);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi đăng ký thông tin tài khoản',
        );
    }
};
