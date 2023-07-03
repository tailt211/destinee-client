import { useIonAlert, useIonToast } from '@ionic/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import { CallState, resetQuestionaire, setMute } from '../../store/call/call.slice';
import SocketContext from '../../store/SocketContext';
import UIEffectContext from '../../store/UIEffectContext';
import { getToast } from '../../utils/toast.helper';

interface Hint {
    hint: string;
    highlight: boolean;
}

const hints: Hint[] = [
    {
        hint: 'Bạn không biết nói gì? Bắt đầu ngay trò chơi kiến tạo tại đây',
        highlight: true,
    },
    {
        hint: 'Kể về những sở thích, đam mê, công việc của bản thân. Hãy cho đối phương biết những gì mà bạn biết',
        highlight: false,
    },
    {
        hint: 'Cố gắng đừng hỏi thông tin cá nhân vì đây đâu phải cuộc hỏi cung đâu đúng không',
        highlight: false,
    },
    {
        hint: 'Cho đối phương biết bạn thấy giọng nói của đối phương như nào đi',
        highlight: false,
    },
];

export default function useOnCalling() {
    const history = useHistory();
    const { pingQuestionSfx, pingErrorSfx, pingSuccessSfx } = useContext(UIEffectContext);
    const { requestQuestionaire, rejectQuestionaire } = useContext(SocketContext);
    const dispatch: AppDispatch = useDispatch();
    const [present, dismiss] = useIonToast();
    const [presentFail, dismissFail] = useIonToast();
    const [presentAlert] = useIonAlert();
    const { questionaire } = useSelector((state: RootState) => state.call) as CallState;
    const questionaireToast = useMemo(() => getToast('Câu hỏi kiến tạo', dismiss, 3000), [dismiss]);
    const questionaireFailToast = useMemo(() => getToast('Câu hỏi kiến tạo', dismissFail, 3000), [dismissFail]);

    const [hint, setHint] = useState<Hint>(hints[0]);
    const [index, setIndex] = useState<number>(0);
    const [isChangeText, setIsChangeText] = useState<boolean>(false);
    const hintDuration = process.env.REACT_APP_CONSTRUCTIVE_QUESTION_HINT_DURATION;

    useEffect(() => {
        const _ = setInterval(() => {
            setHint(hints[index]);
            if (index === hints.length - 1) setIndex(0);
            else setIndex((prev) => prev + 1);

            setIsChangeText((prev) => (prev = !prev));
        }, (hintDuration && parseInt(hintDuration)) || 10000);

        return () => clearInterval(_);
    }, [index, hintDuration]);

    useEffect(() => {
        if (questionaire.isAccepted && !questionaire.answers) {
            pingSuccessSfx();
            history.push(`/${PATHS.CALL}/${PATHS.CALL_QUESTION}`);
            dispatch(setMute(true));
        }
    }, [dispatch, history, questionaire.isAccepted, questionaire.answers, pingSuccessSfx]);

    useEffect(() => {
        if (!(questionaire.isRequesting && questionaire.isAccepted === null)) return;
        present(questionaireToast('Đã gửi yêu cầu, hãy đợi trong giây lát để chờ đối phương chấp thuận', 'success'));
    }, [questionaire.isRequesting, questionaire.isAccepted, present, questionaireToast]);

    useEffect(() => {
        if (!(questionaire.isOpponentRequesting && questionaire.isAccepted === null)) return;
        pingQuestionSfx();
        presentAlert({
            backdropDismiss: false,
            header: 'Câu hỏi kiến tạo',
            message: 'Đối phương muốn cùng bạn tham gia trả lời câu hỏi kiến tạo. Bạn có muốn tham gia?',
            buttons: [
                { text: 'Không tham gia', role: 'cancel', handler: () => rejectQuestionaire() },
                { text: 'Đồng ý', handler: () => requestQuestionaire() },
            ],
        });
    }, [
        questionaire.isOpponentRequesting,
        questionaire.isAccepted,
        pingQuestionSfx,
        rejectQuestionaire,
        requestQuestionaire,
        presentAlert,
    ]);

    useEffect(() => {
        if (!(questionaire.isRequesting && questionaire.isAccepted === false)) return;
        pingErrorSfx()
        presentFail(questionaireFailToast('Đối phương đã từ chối tham gia, bạn có thể thử lại sau', 'fail'))
        dispatch(resetQuestionaire());
    }, [questionaire.isRequesting, questionaire.isAccepted, pingErrorSfx,dispatch, presentFail, questionaireFailToast]);

    return { hint, isChangeText };
}
