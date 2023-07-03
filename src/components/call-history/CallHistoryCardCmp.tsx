import { IonAccordion, IonAccordionGroup } from '@ionic/react';
import React from 'react';
import { REVIEW } from '../../model/call/review.enum';
import { FRIEND_REQUEST_STATUS } from '../../model/friend-request/friend-request-status.enum';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { MBTI_TYPE } from '../../model/personality-test/mbti-type.enum';
import { GENDER } from '../../model/profile/profile.constant';
import CallHistoryActionsCmp from './CallHistoryActionsCmp';
import styles from './CallHistoryCardCmp.module.scss';
import CallHistoryCardDetailCmp from './CallHistoryCardDetailCmp';
import CallHistoryCardHeaderCmp from './CallHistoryCardHeaderCmp';

export interface FriendRequest {
    requester: string;
    verifier: string;
    status: FRIEND_REQUEST_STATUS;
}

const CallHistoryCardCmp: React.FC<{
    avatar?: ImageDTO | string;
    name: string;
    createdAt: string;
    duration: number;
    otherMbtiType: MBTI_TYPE | null;
    yourReviews: REVIEW[];
    otherReviews: REVIEW[];
    yourRate?: number;
    otherRate?: number;
    compatibility?: number;
    gender: GENDER;
    friendRequest: FriendRequest | null;
    otherProfileId: string;
    disableAction?: boolean;
    conversationId?: string;
    disabled?: boolean;
}> = ({
    avatar,
    name,
    createdAt,
    duration,
    otherMbtiType,
    yourReviews,
    otherReviews,
    yourRate,
    otherRate,
    compatibility,
    gender,
    friendRequest,
    otherProfileId,
    disableAction = false,
    conversationId,
    disabled = false,
}) => {
    return (
        <div className={styles.cardHistory}>
            <IonAccordionGroup>
                <IonAccordion value="1" className={styles.historyContent}>
                    <CallHistoryCardHeaderCmp
                        avatar={avatar}
                        name={name}
                        createdAt={createdAt}
                        duration={duration}
                        gender={gender}
                    />

                    <div className={styles.cardDetail} slot="content">
                        <CallHistoryCardDetailCmp
                            otherMbtiType={otherMbtiType}
                            compatibility={compatibility}
                            yourReviews={yourReviews}
                            otherReviews={otherReviews}
                            yourRate={yourRate}
                            otherRate={otherRate}
                        />
                        {!disableAction && (
                            <>
                                <hr className={styles.divider} />
                                <CallHistoryActionsCmp
                                    friendRequest={friendRequest}
                                    profileId={otherProfileId}
                                    avatar={avatar}
                                    name={name}
                                    mbtiType={otherMbtiType}
                                    compatibility={compatibility}
                                    gender={gender}
                                    conversationId={conversationId}
                                    disabled={disabled}
                                />
                            </>
                        )}
                    </div>
                </IonAccordion>
            </IonAccordionGroup>
        </div>
    );
};

export default CallHistoryCardCmp;
