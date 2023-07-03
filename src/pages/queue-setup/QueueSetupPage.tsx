import { IonButton, IonHeader, IonPage, IonRippleEffect, IonSpinner } from '@ionic/react';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import ChoiceCriteriaCmp from '../../components/call-finding/ChoiceCriteriaCmp';
import PageContentCmp from '../../components/container/PageContentCmp';
import InfoSettingCmp from '../../components/info-setting/InfoSettingCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import useQueue from '../../hooks/use-queue';
import useQueueSetup from '../../hooks/use-queue-setup';
import { RootState } from '../../store';
import { QueueState } from '../../store/queue/queue.slice';
import UIEffectContext from '../../store/UIEffectContext';
import styles from './QueueSetupPage.module.scss';

const QueueSetupPage: React.FC<RouteComponentProps> = (props) => {
    const { clickHardFx } = useContext(UIEffectContext);
    const { fieldList } = useQueueSetup();
    const { startQueue } = useQueue();
    /* State */
    const { filter: queueFilter, loading: queueLoading } = useSelector((state: RootState) => state.queue) as QueueState;

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <TitleToolbarCmp title="Tuỳ chỉnh cuộc gọi" />
            </IonHeader>
            <PageContentCmp>
                <div className={styles.container}>
                    <div className="flex flex-col items-center w-full gap-y-[27px]">
                        <div className={styles.queueDuration}>Thời gian tìm kiếm dự kiến mất 15 giây</div>
                        <div className="w-[95%] mb-[-14px]">
                            <ChoiceCriteriaCmp displayTitle={false} filter={queueFilter} />
                        </div>
                        <InfoSettingCmp fieldList={fieldList} />
                    </div>
                    <div className="flex flex-col items-center w-full gap-2 mb-10">
                        <p className="mx-auto text-[15px] text-white text-center">
                            Tiêu chí của bạn khá kén người, bạn sẽ phải đợi ở hàng chờ lâu hơn một tí nhé
                        </p>
                        <IonButton
                            onClick={async () => {
                                clickHardFx();
                                await startQueue();
                            }}
                            className={`${styles.autoMatch}`}
                            disabled={queueLoading}>
                            {queueLoading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                            {!queueLoading && 'Bắt đầu gọi ngay'}
                            <IonRippleEffect />
                        </IonButton>
                    </div>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default QueueSetupPage;
