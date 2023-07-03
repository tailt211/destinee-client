import styles from './FriendRequestCmp.module.scss';

const MESSAGE = 'gửi cho bạn một yêu cầu kết bạn';
const FriendRequestCmp: React.FC<{ name: string; avatar: string; onClick: () => void }> = ({
    name,
    avatar,
    onClick: onClickHandler,
}) => {
    return (
        <div className={styles.container} onClick={onClickHandler}>
            <img src={avatar} alt="avatar" />
            <span>
                <b>{name}</b> {MESSAGE}
            </span>
        </div>
    );
};

export default FriendRequestCmp;
