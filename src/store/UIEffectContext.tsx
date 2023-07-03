import { random } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSound from 'use-sound';
import { PlayFunction } from 'use-sound/dist/types';
import mouseClickSoftMp3 from '../assets/sound/mouse-click-soft.mp3';
import mouseClickMp3 from '../assets/sound/mouse-click.mp3';
import pingSuccessMp3 from '../assets/sound/ping-success.mp3';
import pingQuestionLongMp3 from '../assets/sound/ping-question-long.mp3';
import pingQuestionMp3 from '../assets/sound/ping-question.mp3';
import pingErrorMp3 from '../assets/sound/ping-error.mp3';
import queue1stMp3 from '../assets/sound/queue-1.mp3';
import queue2ndMp3 from '../assets/sound/queue-2.mp3';
import queue3rdMp3 from '../assets/sound/queue-3.mp3';
import queue4thMp3 from '../assets/sound/queue-4.mp3';
import ringVibrateMp3 from '../assets/sound/ring-vibrate.mp3';
import ringLongMp3 from '../assets/sound/ring-long.mp3';
import ringShoftMp3 from '../assets/sound/ring-short.mp3';
import swooshSoftMp3 from '../assets/sound/swoosh-soft.mp3';
import timerLeftMp3 from '../assets/sound/timer-left.mp3';
import vibrateMp3 from '../assets/sound/vibrate.mp3';
import bellDeskMp3 from '../assets/sound/bell-desk.mp3';
import bellSoftMp3 from '../assets/sound/bell-soft.mp3';

type VibrateDuration = 'xs' | 'sm' | 'double' | 'lg' | 'triple' | number;
const UIEffectContext = React.createContext<{
    timerLeftSfx: PlayFunction;
    stopTimerLeft: () => void;
    vibrateSfx: PlayFunction;
    /* click */
    clickSfx: PlayFunction;
    clickSoftSfx: PlayFunction;
    /* swoosh */
    swooshSoftSfx: PlayFunction;
    /* ring */
    ringVibrateSfx: PlayFunction;
    ringShortSfx: PlayFunction;
    ringLongSfx: PlayFunction;
    /* ping */
    pingErrorSfx: PlayFunction;
    pingSuccessSfx: PlayFunction;
    pingQuestionSfx: PlayFunction;
    pingQuestionLongSfx: PlayFunction;
    /* queue */
    queueSfx: PlayFunction;
    stopQueueSfx: () => void;
    /* bell */
    bellDeskSfx: PlayFunction;
    bellSoftSfx: PlayFunction;
    /* vibrate */
    vibrate: (type: VibrateDuration) => void;
    vibrateQueue: () => void;
    stopQueueVibrate: () => void;
    /* Effect */
    clickFx: () => void;
    clickHardFx: () => void;
}>({
    timerLeftSfx: () => {},
    stopTimerLeft: () => {},
    vibrateSfx: () => {},
    /* click */
    clickSfx: () => {},
    clickSoftSfx: () => {},
    /* swoosh */
    swooshSoftSfx: () => {},
    /* ring */
    ringVibrateSfx: () => {},
    ringShortSfx: () => {},
    ringLongSfx: () => {},
    /* ping */
    pingErrorSfx: () => {},
    pingSuccessSfx: () => {},
    pingQuestionSfx: () => {},
    pingQuestionLongSfx: () => {},
    /* queue */
    queueSfx: () => {},
    stopQueueSfx: () => {},
    /* bell */
    bellDeskSfx: () => {},
    bellSoftSfx: () => {},
    /* vibrate */
    vibrate: () => {},
    vibrateQueue: () => {},
    stopQueueVibrate: () => {},
    /* Effect */
    clickFx: () => {},
    clickHardFx: () => {},
});

export const UIEffectProvider = (props: any) => {
    const [clickSfx] = useSound(mouseClickMp3);
    const [clickSoftSfx] = useSound(mouseClickSoftMp3);
    const [swooshSoftSfx] = useSound(swooshSoftMp3);
    const [ringShortSfx] = useSound(ringShoftMp3);
    const [ringLongSfx] = useSound(ringLongMp3);
    const [ringVibrateSfx] = useSound(ringVibrateMp3);
    const [pingSuccessSfx] = useSound(pingSuccessMp3);
    const [pingErrorSfx] = useSound(pingErrorMp3);
    const [pingQuestionSfx] = useSound(pingQuestionMp3);
    const [pingQuestionLongSfx] = useSound(pingQuestionLongMp3);
    const [timerLeftSfx, { stop: stopTimerLeft }] = useSound(timerLeftMp3);
    const [vibrateSfx] = useSound(vibrateMp3);
    const [bellDeskSfx] = useSound(bellDeskMp3);
    const [bellSoftSfx] = useSound(bellSoftMp3);
    const rndQueueSfx = useMemo(() => random(2, 3, false), []); // Chỗ này thay đổi lại range hen
    const [queueSfx, { stop: stopQueueSfx }] = useSound([queue1stMp3, queue2ndMp3, queue3rdMp3, queue4thMp3][rndQueueSfx], {
        volume: 0.3,
    });

    const vibrate = (duration: VibrateDuration) => {
        if (!navigator.vibrate) return;
        const level: { [key in VibrateDuration]: number | number[] } = {
            xs: 50,
            sm: 80,
            lg: 500,
            double: [100, 80, 100],
            triple: [100, 80, 100, 80, 100],
        };
        navigator.vibrate(typeof duration === 'number' ? duration : level[duration]);
    };

    /* Vibrate Queue */
    const [queueVibrate, setQueueVibrate] = useState(false);
    const vibrateQueue = useCallback(() => setQueueVibrate(true), []);
    const stopQueueVibrate = useCallback(() => setQueueVibrate(false), []);
    useEffect(() => {
        if (!navigator.vibrate) return;
        let _: NodeJS.Timeout | null = null;
        if (queueVibrate) {
            _ = setInterval(() => {
                navigator.vibrate([50, 500, 50, 500]);
            }, 1100);
        } else {
            navigator.vibrate(0);
            if (_) clearInterval(_);
        }
        return () => {
            if (_) clearInterval(_);
        };
    }, [queueVibrate]);

    /* Effect */
    const clickFx = useCallback(() => {
        vibrate('xs');
        clickSoftSfx();
    }, [clickSoftSfx]);

    const clickHardFx = useCallback(() => {
        vibrate('sm');
        clickSfx();
    }, [clickSfx]);

    return (
        <UIEffectContext.Provider
            value={{
                timerLeftSfx,
                stopTimerLeft,
                vibrateSfx,
                /* click */
                clickSfx,
                clickSoftSfx,
                /* swoosh */
                swooshSoftSfx,
                /* ring */
                ringVibrateSfx,
                ringShortSfx,
                ringLongSfx,
                /* ping */
                pingErrorSfx,
                pingSuccessSfx,
                pingQuestionSfx,
                pingQuestionLongSfx,
                /* queue */
                queueSfx,
                stopQueueSfx,
                /* bell */
                bellDeskSfx,
                bellSoftSfx,
                /* vibratte */
                vibrate,
                vibrateQueue,
                stopQueueVibrate,
                /* Effect */
                clickFx,
                clickHardFx,
            }}>
            {props.children}
        </UIEffectContext.Provider>
    );
};

export default UIEffectContext;
