import { useIonAlert } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import slugify from 'slugify';
import { MessageDTO } from '../../model/message/dto/message.dto';
import { PATHS } from '../../router/paths';
import { RootState } from '../../store';
import styles from './ChatContentCmp.module.scss';

interface ChatMessageCmp {
    message: MessageDTO;
    avatar: string;
    otherProfileId: string;
    name: string;
}

const ChatContentCmp: React.FC<ChatMessageCmp> = ({ message, avatar, otherProfileId, name }) => {
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    /* State */
    const { friends } = useSelector((state: RootState) => state.friend);
    /* Config */
    const chatContainerClasses = classNames([styles.chatContainer], {
        [styles.other]: !message.isMine,
        [styles.mine]: message.isMine,
    });
    /* Handler */
    const openOtherProfilePageHandler = (otherProfileId: string, name: string) => {
        const isFriend = friends.find((friend) => friend.id === otherProfileId);
        if (!isFriend) {
            presentAlert({
                backdropDismiss: true,
                header: 'Xem trang cá nhân',
                message: `Hãy kết bạn để xem được trang cá nhân của ${name}`,
                buttons: [{ text: 'Tôi hiểu rồi', role: 'cancel', handler: () => {} }],
            });
            return;
        }
        history.push(`/${PATHS.FRIEND}/${otherProfileId}/${slugify(name, { lower: true })}`);
    };

    return (
        <div className={chatContainerClasses}>
            {!message.isLastMessage && <div className={styles.content}>{message.content}</div>}
            {message.isLastMessage && (
                <div className={styles.lastMessageContainer}>
                    {!message.isMine && (
                        <img
                            className={styles.avatar}
                            src={avatar}
                            alt="avatar"
                            onClick={() => openOtherProfilePageHandler(otherProfileId, name)}
                        />
                    )}
                    <div className={styles.content}>{message.content}</div>
                    {message.isMine && <img className={styles.avatar} src={avatar} alt="avatar" />}
                </div>
            )}
        </div>
    );
};

export default ChatContentCmp;
