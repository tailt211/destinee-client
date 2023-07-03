import { useIonToast } from '@ionic/react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { PATHS } from '../router/paths';
import { AppDispatch, RootState } from '../store';
import { enableAudio, HomeState } from '../store/home/home.slice';
import { getToast } from '../utils/toast.helper';

const useRegistration = () => {
    const history = useHistory();
    const dispatch = useDispatch<AppDispatch>();
    const [present, dismiss] = useIonToast();
    const registrationToaster = useMemo(() => getToast('Lưu ý', dismiss, 5000), [dismiss]);
    /* State */
    const { processing: registrationProcessing } = useSelector((state: RootState) => state.registration);
    const { isAudioReady } = useSelector((state: RootState) => state.home) as HomeState;
    /* Effect */
    useEffect(() => {
        if (registrationProcessing) history.replace(`/${PATHS.REGISTRATION}`);
    }, [registrationProcessing, history]);

    useEffect(() => {
        if (isAudioReady) return;
        navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((stream) => {
                // stream.getTracks().forEach((track) => track.stop());
                dispatch(enableAudio());
            })
            .catch((err) =>
                present(registrationToaster(`Bạn sẽ không thể thực hiện cuộc gọi vì đã từ chối cấp quyền truy cập microphone`, 'fail')),
            );
    }, [isAudioReady, present, registrationToaster, dispatch]);
};

export default useRegistration;
