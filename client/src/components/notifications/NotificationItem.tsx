import React from 'react';
import WSButton from '../WSButton';
import '../../css/notification-item.css';

export interface NotificationItemProps {
    id: number;
    text: string;
    image?: string;
    actionLabel?: string;
    onAction?: () => void;
    onClose: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    id,
    text,
    image,
    actionLabel,
    onAction,
    onClose,
}) => {
    return (
        <div className="notification-item">
            <div className="notification-img-wrapper">
                {image && <img src={image} alt="Avatar" className="notification-img" />}
            </div>

            <div className="notification-content">
                <p className="notification-text">{text}</p>
                {actionLabel && (
                    <div className="notification-action">
                        <WSButton
                            label={actionLabel}
                            size="small"
                            onClick={onAction}
                            className="notification-action-btn"
                        />
                    </div>
                )}
            </div>

            <button
                className="notification-close"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(id);
                }}
                aria-label="Dismiss notification"
            >
                <span className="codicon codicon-close"></span>
            </button>
        </div>
    );
};

export default NotificationItem;