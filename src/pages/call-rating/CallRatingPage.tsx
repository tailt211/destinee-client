import { IonButton, IonHeader, IonIcon, IonPage, useIonToast } from '@ionic/react';
import { star } from 'ionicons/icons';
import { range } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ChipItem, chipList } from '../../components/call-rating/chip-item';
import PersonalityChipCmp from '../../components/call-rating/PersonalityChipCmp';
import PageContentCmp from '../../components/container/PageContentCmp';
import AvatarToolbarCmp from '../../components/toolbar/AvatarToolbarCmp';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { CallState } from '../../store/call/call.slice';
import { finishCallThunk } from '../../store/call/call.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import UIEffectContext from '../../store/UIEffectContext';
import { secondToTimerFormat } from '../../utils/formatter';
import styles from './CallRatingPage.module.scss';

const CallRatingPage: React.FC = () => {
    const history = useHistory();
    const dispatch: AppDispatch = useDispatch();
    const [present, dismiss] = useIonToast();
    const { clickFx, swooshSoftSfx } = useContext(UIEffectContext);
    const MAX_CHIP = 3;
    // const finishCallRef = useRef<HTMLButtonElement>(null);

    /* State */
    const { timer, callHistoryId, loading, isCallEnded } = useSelector((state: RootState) => state.call) as CallState;
    const { _id } = useSelector((state: RootState) => state.profile) as ProfileState;
    const [rating, setRating] = useState<number>(0);
    const [activeChips, setActiveChips] = useState(new Set<ChipItem>());

    /* Handle  */
    const rateHandler = (value: number) => {
        setRating(value);
    };

    const chipSelectHandler = (chip: ChipItem) => {
        if (activeChips.has(chip)) {
            setActiveChips((prev) => {
                const newChips = new Set(prev);
                newChips.delete(chip);
                return newChips;
            });
            return;
        }
        if (activeChips.size >= MAX_CHIP) {
            present({
                buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
                message: `Đã chọn tối đa ${MAX_CHIP} từ khoá`,
                color: 'light-red',
                cssClass: 'text-white',
                header: 'Đánh giá cuộc gọi',
                duration: 2000,
            });
            return;
        }
        setActiveChips((prev) => new Set(prev.add(chip)));
    };

    const finishHandler = async () => {
        clickFx();
        if (rating === 0 && activeChips.size < 3) {
            present({
                buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
                message: `Bạn cần đánh giá sao & chọn ít nhất 3 từ khoá tính cách`,
                color: 'light-red',
                cssClass: 'text-white',
                header: 'Đánh giá cuộc gọi',
                duration: 4000,
            });
            return;
        }
        if (rating === 0) {
            present({
                buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
                message: `Bạn cần đánh giá sao cho cuộc gọi`,
                color: 'light-red',
                cssClass: 'text-white',
                header: 'Đánh giá cuộc gọi',
                duration: 4000,
            });
            return;
        }
        if (activeChips.size < 3) {
            present({
                buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
                message: `Bạn cần chọn ít nhất 3 từ khoá tính cách`,
                color: 'light-red',
                cssClass: 'text-white',
                header: 'Đánh giá cuộc gọi',
                duration: 4000,
            });
            return;
        }

        const { meta } = await dispatch(
            finishCallThunk({
                callHistoryId: callHistoryId!,
                body: {
                    callerId: _id,
                    rates: rating,
                    reviews: Array.from(activeChips.values()).map((chip) => chip.key),
                },
            }),
        );
        if (meta.requestStatus === 'fulfilled') {
            swooshSoftSfx();
            history.push(`${TAB_URL}/${PATHS.HOME}`); // Chỗ này phải được sửa vì sẽ có bugd({ profileId }));
        }
        // finishCallRef.current?.click();
    };

    /* Effect */
    useEffect(() => {
        if (!isCallEnded) history.push(`${TAB_URL}/${PATHS.HOME}`);
    }, [isCallEnded, history]);

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <AvatarToolbarCmp isBackBtn={false} />
            </IonHeader>
            <PageContentCmp>
                <div className={styles.container}>
                    <div className={styles.infoContainer}>
                        <p className={styles.title}>Cuộc gọi đã kết thúc</p>
                        <p className={styles.timer}>{secondToTimerFormat(timer, true)}</p>
                    </div>

                    <div className={styles.ratingContainer}>
                        <span>Đánh giá trò chuyện của bạn</span>
                        <div className={styles.starContainer}>
                            {range(1, 6).map((index) => {
                                const style = rating < index ? 'inactiveColor' : 'activeColor';
                                return (
                                    <IonIcon
                                        icon={star}
                                        className={styles[style]}
                                        key={index}
                                        onClick={rateHandler.bind(null, index)}></IonIcon>
                                );
                            })}
                        </div>
                        <span>Hãy cho chúng tôi biết cảm nhận của bạn về cuộc gọi &amp; tính cách của đối phương</span>
                    </div>

                    <div className={styles.personalityContainer}>
                        {chipList.map((chip) => (
                            <PersonalityChipCmp
                                key={chip.key}
                                chip={chip}
                                active={activeChips.has(chip)}
                                onChipSelected={chipSelectHandler}></PersonalityChipCmp>
                        ))}
                    </div>
                    <IonButton onClick={finishHandler} expand="block" disabled={loading}>
                        Hoàn tất
                    </IonButton>
                    {/* <Link
                        to={{
                            pathname: '/tabs/home',
                            state: { isPeronalityTest: true },
                        }}>
                        <button ref={finishCallRef} className={'hidden'} />
                    </Link> */}
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default CallRatingPage;
