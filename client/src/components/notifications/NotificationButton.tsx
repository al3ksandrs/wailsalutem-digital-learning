import React from 'react';
import '../../css/notifications/notification-button.css';

interface NotificationButtonProps {
    count?: number;
    darkMode?: boolean;
    onClick?: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
    count,
    darkMode,
    onClick
}) => {

    const showBadge = count! > 0;
    const displayCount = count! > 99 ? '99+' : count;
    const ariaLabel = showBadge
        ? `Notifications (${count} new)`
        : 'Notifications';

    return (
        <button
            type="button"
            className={`notification-btn-container ${darkMode ? 'mode-dark' : 'mode-light'}`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <div className="codicon codicon-bell"></div>

            {showBadge && (
                <span className="notification-badge">
                    {displayCount}
                </span>
            )}
        </button>
    );
};

export default NotificationButton;