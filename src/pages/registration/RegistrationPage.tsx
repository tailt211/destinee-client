import {
    IonDatetime,
    IonIcon,
    IonItem,
    IonPage,
    IonRippleEffect,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    useIonAlert,
    useIonPicker,
    useIonToast,
} from '@ionic/react';
import classNames from 'classnames';
import { arrowRedo, arrowUndo, cameraOutline } from 'ionicons/icons';
import { isEmpty, range } from 'lodash';
import moment from 'moment';
import { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import PageContentCmp from '../../components/container/PageContentCmp';
import {
    genderDisplayer,
    jobDisplayer,
    languageDisplayer,
    regionDisplayer,
    sexDisplayer,
} from '../../components/info-setting/field-section/field-section-displayer';
import { capitalizeValue } from '../../components/info-setting/field-section/field-section.helper';
import { FieldOptions } from '../../components/info-setting/field-section/field-section.type';
import { GENDER } from '../../model/profile/profile.constant';
import { RegAnswerKey } from '../../model/registration/request/registration-submit.request';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import {
    clearError as clearRegistrationError,
    nextQuestion,
    resetState as resetRegistrationState,
    setLoading as setRegistrationLoading,
    undoQuestion,
} from '../../store/registration/registration.slice';
import { addRegistionTokenThunk, submitAnswerThunk, uploadAvatarThunk } from '../../store/registration/registration.thunk';
import { getToast } from '../../utils/toast.helper';
import styles from './RegistrationPage.module.scss';

type QuestionOption = {
    title: string;
    modalTitle: string;
    answerKey: RegAnswerKey | 'avatar';
    hint?: string;
    options?: FieldOptions;
    type: 'text' | 'option' | 'options' | 'date' | 'height' | 'avatar';
    skipable: boolean;
    handler: (value: string | string[] | number | null | File | undefined, skip?: boolean) => Promise<void | { error: string }>;
};

const SKIP_WARNING = 'Nhấp vào bỏ qua thông tin này bên dưới bạn thực sự không muốn chia sẻ';
const questionOptions: (dispatch: AppDispatch) => QuestionOption[] = (dispatch) => {
    return [
        {
            title: '1. Tên của bạn là',
            modalTitle: 'Tên',
            answerKey: 'name',
            type: 'text',
            skipable: false,
            handler: async (value) => {
                if (isEmpty(value)) return { error: 'Tên không được để trống' };
                await dispatch(submitAnswerThunk({ answerKey: 'name', value: value as string }));
            },
        },
        {
            title: '2. Nickname mà bạn muốn',
            modalTitle: 'Nickname',
            answerKey: 'nickname',
            hint: 'Sử dụng khi bạn không muốn hiển thị tên thật của mình cho ai biết',
            type: 'text',
            skipable: false,
            handler: async (value) => {
                if (isEmpty(value)) return { error: 'Nickname không được để trống' };
                await dispatch(submitAnswerThunk({ answerKey: 'nickname', value: value as string }));
            },
        },
        {
            title: '3. Ảnh đại diện của bạn',
            type: 'avatar',
            modalTitle: 'Ảnh đại diện',
            answerKey: 'avatar',
            skipable: false,
            hint: 'Nhấp vào ảnh để thay đổi',
            handler: async (file) => {
                if (!file) return { error: 'Bạn không thể tải tệp trống' };
                await dispatch(uploadAvatarThunk({ file: file as File }));
            },
        },
        {
            title: '4. Bạn hiện đang ở',
            type: 'option',
            modalTitle: 'Sống tại',
            answerKey: 'origin',
            options: regionDisplayer,
            skipable: false,
            handler: async (value) => {
                if (!value) return { error: 'Nơi sinh sống không được để trống' };
                await dispatch(submitAnswerThunk({ answerKey: 'origin', value: value as string }));
            },
        },
        {
            title: '5. Giới tính sinh học của bạn',
            type: 'option',
            modalTitle: 'Giới tính',
            answerKey: 'gender',
            options: genderDisplayer,
            skipable: false,
            handler: async (value) => {
                if (isEmpty(value)) return { error: 'Giới tính không được để trống' };
                await dispatch(submitAnswerThunk({ answerKey: 'gender', value: value === GENDER.MALE ? true : false }));
            },
        },
        {
            title: '6. Xu hướng tính dục của bạn',
            type: 'option',
            modalTitle: 'Xu hướng tính dục',
            answerKey: 'sex',
            options: sexDisplayer,
            skipable: false,
            handler: async (value) => {
                if (isEmpty(value)) return { error: 'Xu hướng tính dục không được để trống' };
                await dispatch(submitAnswerThunk({ answerKey: 'sex', value: value as string }));
            },
        },
        {
            title: '7. Chiều cao của bạn',
            type: 'height',
            modalTitle: 'Chiều cao',
            answerKey: 'height',
            skipable: true,
            handler: async (value, skip = false) => {
                if (!skip && !value) return { error: SKIP_WARNING };
                await dispatch(submitAnswerThunk({ answerKey: 'height', value: value as number }));
            },
        },
        {
            title: '8. Ngôn ngữ bạn thường dùng',
            type: 'options',
            modalTitle: 'Ngôn ngữ',
            answerKey: 'languages',
            options: languageDisplayer,
            skipable: true,
            handler: async (value, skip = false) => {
                if (!skip && isEmpty(value)) return { error: SKIP_WARNING };
                await dispatch(submitAnswerThunk({ answerKey: 'languages', value: value as string[] }));
            },
        },
        {
            title: '9. Bạn đang làm công việc',
            type: 'option',
            modalTitle: 'Công việc',
            answerKey: 'job',
            options: jobDisplayer,
            skipable: true,
            handler: async (value, skip = false) => {
                if (!skip && isEmpty(value)) return { error: SKIP_WARNING };
                await dispatch(submitAnswerThunk({ answerKey: 'job', value: value as string }));
            },
        },
        {
            title: '10. Bạn làm việc tại',
            type: 'text',
            modalTitle: 'Nơi làm việc',
            answerKey: 'workAt',
            skipable: true,
            handler: async (value, skip = false) => {
                if (!skip && isEmpty(value)) return { error: SKIP_WARNING };
                await dispatch(submitAnswerThunk({ answerKey: 'workAt', value: value as string }));
            },
        },
        {
            title: '11. Bạn làm trong lĩnh vực',
            type: 'text',
            modalTitle: 'Ngành',
            answerKey: 'major',
            skipable: true,
            handler: async (value, skip = false) => {
                if (!skip && isEmpty(value)) return { error: SKIP_WARNING };
                await dispatch(submitAnswerThunk({ answerKey: 'major', value: value as string }));
            },
        },
        {
            title: '12. Bạn sinh ngày',
            type: 'date',
            modalTitle: 'Ngày sinh',
            answerKey: 'birthdate',
            skipable: false,
            handler: async (value) => {
                if (isEmpty(value)) return { error: 'Ngày sinh không được để trống' };
                await dispatch(submitAnswerThunk({ answerKey: 'birthdate', value: value as string }));
            },
        },
    ];
};

const RegistrationPage: React.FC<RouteComponentProps> = ({ history }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [presentPicker] = useIonPicker();
    const [presentAlert] = useIonAlert();
    const [present, dismiss] = useIonToast();
    const registrationToast = getToast('Đăng ký tài khoản', dismiss, 2000);
    const questions = useMemo(() => questionOptions(dispatch), [dispatch]);
    /* Ref */
    const textInputRef = useRef<HTMLInputElement>(null);
    const selectInputRef = useRef<HTMLIonSelectElement>(null);
    const dateInputRef = useRef<HTMLIonDatetimeElement>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);
    /* State */
    const { loading, answer, currentIndex, noAnswered, submitting, error, isFinished, processing } = useSelector(
        (state: RootState) => state.registration,
    );
    const question = useMemo(() => questions[currentIndex], [currentIndex, questions]);
    const progress = useMemo(() => Math.ceil((noAnswered / questions.length) * 100), [noAnswered, questions.length]);
    /* Effect */
    useEffect(
        () => () => {
            dispatch(resetRegistrationState());
        },
        [dispatch],
    );

    // useEffect(() => {
    //     if (question?.type === 'text' && textInputRef.current) textInputRef.current.focus();
    // }, [question]);

    useEffect(() => {
        if (!processing) history.replace(`${TAB_URL}/${PATHS.HOME}`);
    }, [processing, history]);

    useEffect(() => {
        if (question?.type === 'text' && textInputRef.current)
            textInputRef.current.value = (answer[question?.answerKey] as string) || '';
        if (['option', 'options'].includes(question?.type) && selectInputRef.current)
            selectInputRef.current.value = answer[question?.answerKey];
        if (question?.type === 'date' && dateInputRef.current) dateInputRef.current.value = answer[question?.answerKey] as string;
        dispatch(setRegistrationLoading(false));
    }, [answer, question, dispatch]);

    useEffect(() => {
        if (processing && isFinished) {
            presentAlert({
                backdropDismiss: false,
                header: 'Đăng ký tài khoản',
                message:
                    'Bạn đã đăng ký thành công tài khoản, chào mừng thành viên mới của chúng ta. Destinee cám ơn bạn và chúc bạn sẽ có trải nghiệm tuyệt vời. Kim chỉ nam của chúng tôi là giúp bạn có trải nghiệm tốt nhất, hãy cho chúng tôi biết những gì cần cải thiện nhé',
                buttons: [
                    {
                        text: 'Tôi hiểu rồi, Cheers',
                        role: 'cancel',
                        handler: () => {
                            dispatch(addRegistionTokenThunk());
                            history.replace(`${TAB_URL}/${PATHS.HOME}?new=true`);
                        },
                    },
                ],
            });
        }
    }, [processing, isFinished, history, dispatch, presentAlert]);

    useEffect(() => {
        if (error) present(registrationToast(error, 'fail', undefined, () => dispatch(clearRegistrationError())));
    }, [dispatch, error, present, registrationToast]);
    /* Handler */
    const undoHandler = () => {
        dispatch(undoQuestion());
    };
    const nextHandler = async () => {
        if (currentIndex === questions.length - 1) {
            presentAlert({
                backdropDismiss: false,
                header: 'Đăng ký tài khoản',
                message:
                    'Bạn sẽ đăng ký tài khoản Destinee với những thông tin vừa nhập, sau này bạn hoàn toàn có thể thay đổi ở phần chỉnh sửa hồ sơ',
                buttons: [
                    {
                        text: 'Tôi hiểu rồi, đăng ký',
                        handler: () => submitHandler(),
                    },
                    {
                        text: 'Còn chỉnh sửa',
                        role: 'cancel',
                    },
                ],
            });
            return;
        }
        dispatch(nextQuestion());
    };

    const submitHandler = async () => {
        if (loading) return;
        let inputValue: string = '';
        inputValue = question?.type === 'text' ? (textInputRef.current?.value as string) || '' : inputValue;
        inputValue = ['option', 'options'].includes(question?.type)
            ? (selectInputRef.current?.value as string) || ''
            : inputValue;
        inputValue = question?.type === 'date' ? (dateInputRef.current?.value as string) || '' : inputValue;
        if (answer[question?.answerKey] === inputValue) return;
        const result = await question?.handler(inputValue);
        if (result?.error) present(registrationToast(result.error, 'fail', undefined));
    };

    const skipHandler = async () => {
        const result = await question?.handler(null, true);
        if (result?.error) present(registrationToast(result.error, 'fail', undefined));
    };

    const uploadAvatarHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        question?.handler(file).then((result) => {
            if (result?.error) present(registrationToast(result.error, 'fail', undefined));
        });
        // const { meta } = await dispatch(uploadPostThunk({ file: file }));
        // if (meta.requestStatus === 'fulfilled') present(postToast('Đăng thành công', 'success'));
    };

    const openHeightModal = (lastValue: number = 165) => {
        presentPicker(
            [
                {
                    name: 'centemeter',
                    options: range(120, 230, 1).map((count) => ({
                        text: `${count} cm`,
                        value: count.toString(),
                    })),
                    prefix: 'Chiều cao',
                    selectedIndex: lastValue - 120, // minus min để lấy index
                },
            ],
            [
                {
                    text: 'Lưu',
                    handler: (selected) => {
                        const value = parseInt(selected.centemeter.value);
                        if (lastValue === value) return;
                        question?.handler(value).then((result) => {
                            if (result?.error) present(registrationToast(result.error, 'fail', undefined));
                        });
                    },
                },
            ],
        );
    };

    return (
        <IonPage className="grey__bg">
            <PageContentCmp customStyle={{ marginTop: '10px' }}>
                <div className={styles.container}>
                    <div className={styles.contentContainer}>
                        <div className={styles.progressBarContainer}>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progress}
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                            <span>
                                Đã hoàn thành {noAnswered}/{questions.length} bước
                            </span>
                        </div>
                        {question && (
                            <div className={styles.inputForm}>
                                <h3>{question?.title}</h3>
                                {question?.type === 'text' && (
                                    <input
                                        type="text"
                                        ref={textInputRef}
                                        onKeyDown={(e) => e.key === 'Enter' && submitHandler()}
                                        onBlur={submitHandler}
                                    />
                                )}
                                {['option', 'options'].includes(question?.type) && question?.options && (
                                    <IonSelect
                                        ref={selectInputRef}
                                        onIonChange={submitHandler}
                                        disabled={submitting}
                                        multiple={question?.type === 'options'}
                                        placeholder="Nhấp vào đây để lựa chọn"
                                        okText="Chọn"
                                        cancelText="Huỷ"
                                        color="teal">
                                        {Object.entries(question?.options).map(([key, title]) => (
                                            <IonSelectOption value={key} key={key}>
                                                {capitalizeValue(title, 'all-word')}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                )}
                                {question?.type === 'date' && (
                                    <IonDatetime
                                        ref={dateInputRef}
                                        // onIonChange={submitHandler}
                                        disabled={submitting}
                                        className={styles.customDatePicker}
                                        color="teal"
                                        locale="vi-VN"
                                        presentation="date"
                                        title={question?.modalTitle}
                                        value={moment('22/03/2000', 'DD/MM/YYYY').format('YYYY-MM-DD')}
                                        max={moment().subtract(18, 'years').format('YYYY-MM-DD')}
                                    />
                                )}
                                {question?.type === 'height' && (
                                    <IonItem
                                        button={true}
                                        onClick={openHeightModal.bind(null, answer[question?.answerKey] as number)}
                                        disabled={submitting}>
                                        {answer[question?.answerKey] ? `${answer[question?.answerKey]} cm` : 'Chọn chiều cao'}
                                    </IonItem>
                                )}
                                {question?.type === 'avatar' && (
                                    <>
                                        <input
                                            type="file"
                                            ref={inputFileRef}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={uploadAvatarHandler}
                                        />
                                        {(!answer[question?.answerKey] || submitting) && (
                                            <div
                                                className={classNames(['ion-activatable', 'ripple-parent', styles.btnUpload])}
                                                onClick={() => {
                                                    if (!submitting) inputFileRef.current?.click();
                                                }}>
                                                {!submitting && (
                                                    <>
                                                        <IonIcon icon={cameraOutline} />
                                                        <span>Tải ảnh</span>
                                                        <IonRippleEffect />
                                                    </>
                                                )}
                                                {submitting && <IonSpinner color="black" name="crescent" className="m-auto" />}
                                            </div>
                                        )}
                                        {answer[question?.answerKey] && !submitting && (
                                            <img
                                                className={styles.avatar}
                                                src={answer[question?.answerKey] as string}
                                                alt="avatar"
                                                onClick={() => {
                                                    if (!submitting) inputFileRef.current?.click();
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                                {question?.hint && <span>{question?.hint}</span>}
                            </div>
                        )}
                        {question?.skipable && (
                            <div className={styles.skipContainer}>
                                <span className={styles.skip} onClick={skipHandler}>
                                    Bỏ qua thông tin này
                                </span>
                                <div className={styles.line} />
                            </div>
                        )}
                        <div className={styles.positionBtnContainer}>
                            {currentIndex > 0 && (
                                <button onClick={undoHandler} disabled={submitting}>
                                    <IonIcon icon={arrowUndo} /> Hoàn tác
                                </button>
                            )}
                            {currentIndex < noAnswered + 1 && (
                                <button onClick={nextHandler} disabled={submitting}>
                                    Tiếp tục <IonIcon icon={arrowRedo} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default RegistrationPage;
