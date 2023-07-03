import { IonIcon, IonRippleEffect, IonSpinner, useIonToast } from '@ionic/react';
import classNames from 'classnames';
import { cameraOutline } from 'ionicons/icons';
import { ChangeEvent, FC, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';
import { AppDispatch } from '../../store';
import { uploadPostThunk } from '../../store/my-profile/my-profile.thunk';
import { getToast } from '../../utils/toast.helper';
import styles from './ProfilePostsCmp.module.scss';

const ProfilePostsCmp: FC<{
    posts: PostOverallDTO[];
    renderImageUpload?: boolean;
    isSubmitting: boolean;
    loading: boolean;
}> = function ({ posts, renderImageUpload, isSubmitting, loading }) {
    const [present, dismiss] = useIonToast();
    const postToast = getToast('Bài viết', dismiss, 1500);
    const dispatch: AppDispatch = useDispatch();
    /* Ref */
    const inputFileRef = useRef<HTMLInputElement>(null);
    /* Handler */
    const uploadPostHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (!file) return;
        const { meta } = await dispatch(uploadPostThunk({ file: file }));
        if (meta.requestStatus === 'fulfilled') present(postToast('Đăng thành công', 'success'));
    };

    return (
        <>
            {loading && <IonSpinner color="white" name="crescent" className="m-auto mt-10" />}
            <div className={styles.images}>
                <input type="file" ref={inputFileRef} accept="image/*" className="hidden" onChange={uploadPostHandler} />
                {renderImageUpload && !loading && (
                    <div
                        className={classNames(['ion-activatable', 'ripple-parent', styles.btnUpload])}
                        onClick={() => {
                            if (!(loading || isSubmitting)) inputFileRef.current?.click();
                        }}>
                        {!isSubmitting && (
                            <>
                                <IonIcon icon={cameraOutline} />
                                <span>Tải ảnh</span>
                                <IonRippleEffect />
                            </>
                        )}
                        {isSubmitting && <IonSpinner color="black" name="crescent" className="m-auto" />}
                    </div>
                )}
                {posts.map((p, i) => (
                    <img src={p.image.types?.find((t) => t.type === TYPE_IMAGE.RESIZED)?.url} alt="profile" key={i} />
                ))}
            </div>
        </>
    );
};

export default ProfilePostsCmp;
