import React, { useState } from 'react';
import NotificationButton from './NotificationButton';
import NotificationItem from './NotificationItem';
import '../../css/notifications/notification-parent.css';
import { useNavigate } from 'react-router-dom';

// hardcoded for demonstration purposes but will use a service here later
const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        text: "Je hebt een nieuwe connectie met: Jan Hooiberg",
        image: "https://i.pravatar.cc/150",
    },
    {
        id: 2,
        text: "2 nieuwe matchvoorstellen zijn gevonden",
    },
    {
        id: 3,
        text: "Jan Hooiberg heeft je een nieuw bericht gestuurd",
        image: "https://i.pravatar.cc/300",
        actionLabel: "Naar berichten"
    }
];

const Notifications: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const navigate = useNavigate();

    const toggleOpen = () => setIsOpen(!isOpen);
    const closeNotifications = () => setIsOpen(false);

    const handleCloseItem = (id: number) => {
        setNotifications((prev) => prev.filter(n => n.id !== id));
    };

    const hasNotifications = notifications.length > 0;

    const handleButtonAction = () => {
        // for now just navigates to the main page, must be changed later
        navigate('/');
        closeNotifications();
    };

    return (
        <div className="notification-parent-wrapper">
            <NotificationButton
                count={notifications.length}
                darkMode={false}
                onClick={toggleOpen}
            />

            {isOpen && hasNotifications && (
                <>
                    <button
                        type="button"
                        className="notification-backdrop"
                        onClick={closeNotifications}
                        aria-label="Close notifications"
                    />

                    <div className="notification-dropdown">
                        {notifications.map((notif) => (
                            <NotificationItem
                                key={notif.id}
                                id={notif.id}
                                text={notif.text}
                                image={notif.image}
                                actionLabel={notif.actionLabel}
                                onClose={handleCloseItem}
                                onAction={() => handleButtonAction()} 
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;