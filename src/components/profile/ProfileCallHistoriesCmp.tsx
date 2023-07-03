import { IonSpinner } from '@ionic/react';
import { FC } from 'react';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import CallHistoryCardCmp from '../call-history/CallHistoryCardCmp';
import styles from './ProfileCallHistoriesCmp.module.scss';

const ProfileCallHistoriesCmp: FC<{
    loading?: boolean;
    histories?: CallHistoryDTO[];
}> = ({ histories, loading }) => {
    return (
        <div className={styles.histories}>
            {loading && <IonSpinner color="white" name="crescent" className="m-auto mt-3" />}
            {!loading && histories && histories.length <= 0 && (
                <div className="emptyList">
                    <h2>Hai bạn chưa có cuộc gọi nào</h2>
                </div>
            )}
            {!loading &&
                histories &&
                histories.length > 0 &&
                histories.map((history) => {
                    return (
                        <CallHistoryCardCmp
                            key={history.id}
                            avatar={history.other.avatar}
                            name={history.other.name}
                            createdAt={history.createdAt}
                            duration={history.duration}
                            otherMbtiType={history.other.mbtiResult?.type || null}
                            otherReviews={history.other.reviews}
                            yourReviews={history.your.reviews}
                            otherRate={history.your.rate}
                            compatibility={history.compatibility}
                            gender={history.other.gender}
                            otherProfileId={history.other.id}
                            friendRequest={null}
                            disableAction={true}
                        />
                    );
                })}
        </div>
    );
};

export default ProfileCallHistoriesCmp;
