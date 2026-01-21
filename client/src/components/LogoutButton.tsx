import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../services/authService';
import '../css/logout-button.css';

interface LogoutButtonProps {
    onClick?: () => void;
    performLogout?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, performLogout = true }) => {
    const navigate = useNavigate();
    const logoutMutation = useLogout();

    const handleLogout = () => {
        // If we shouldn't perform the actual logout (like just open a modal), 
        // run the callback and return early.
        if (!performLogout) {
            if (onClick) onClick();
            return;
        }

        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                // Redirects to login page
                navigate('/');
                
                // Runs any extra custom logic passed via props (optional)
                if (onClick) onClick();
            },
            onError: (error) => {
                console.error('Logout failed', error);
                // Forces navigation even if server fails, to clear client state
                navigate('/');
            }
        });
    };

    return (
        <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            disabled={performLogout && logoutMutation.isPending}
        >
            <div className="codicon codicon-sign-out logout-icon"></div>
            <span className="logout-text">
                {performLogout && logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </span>
        </button>
    );
};

export default LogoutButton;