import { IonHeader, IonPage } from '@ionic/react';
import { FC } from 'react';
import PageContentCmp from '../../components/container/PageContentCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import styles from './PersonalityTestType.module.scss';

export interface ResultsComment {
    comment: string;
}

const resultsComments: ResultsComment[] = [
    {
        comment:
            'Bạn là người chu đáo và duy tâm, bạn cố gắng có tác động tích cực đến những người khác và thế giới xung quanh họ.',
    },
    {
        comment: 'Bạn hiếm khi trốn tránh cơ hội để làm điều đúng đắn, ngay cả khi làm điều đó là điều quá dễ dàng.',
    },
    {
        comment:
            'Niềm đam mê và sức hút của bạn cho phép bạn truyền cảm hứng cho những người khác không chỉ trong sự nghiệp mà còn trong mọi lĩnh vực của cuộc sống, bao gồm cả các mối quan hệ của họ.',
    },
    {
        comment:
            'Hướng dẫn bạn bè & người thân yêu phát triển thành bản thân tốt nhất của họ là điều mang lại cho họ cảm giác vui vẻ & trọn vẹn.',
    },
];

const PersonalityTestType: FC = () => {
    return (
        <IonPage className="grey__bg">
            <IonHeader>
                <TitleToolbarCmp title="" />
            </IonHeader>
            <PageContentCmp scrollY={true}>
                <div className={styles.container}>
                    <div className={styles.resultContainer}>
                        <div className={styles.titleResult}>
                            <span>Bạn là kiểu người</span>
                            <p>Nhân vật chính</p>
                            <span>ENFJ</span>
                        </div>
                        <div className={styles.line} />
                    </div>

                    <div className={styles.contentContainer}>
                        {resultsComments.map((comments, key) => (
                            <div className={styles.content} key={key}>
                                <div className={styles.dot} />
                                <p>{comments.comment}</p>
                            </div>
                        ))}
                        <span>Lên tiếng về điều đúng</span>
                        {resultsComments.map((comments, key) => (
                            <div className={styles.content} key={key}>
                                <div className={styles.dot} />
                                <p>{comments.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default PersonalityTestType;
