import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../services/authService';
import '../css/logout-button.css';

interface LogoutButtonProps {
    onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
    const navigate = useNavigate();
    const logoutMutation = useLogout();

    const handleLogout = () => {
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
            disabled={logoutMutation.isPending}
        >
            <div className="codicon codicon-sign-out logout-icon"></div>
            <span className="logout-text">
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </span>
        </button>
    );
};

export default LogoutButton;