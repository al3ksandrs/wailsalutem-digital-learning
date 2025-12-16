import React from 'react';
import '../css/logout-button.css';

interface LogoutButtonProps {
    onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
    return (
        <button
            type="button"
            className="logout-btn"
            onClick={onClick}
        >
            <div className="codicon codicon-sign-out logout-icon"></div>
            <span className="logout-text">Logout</span>
        </button>
    );
};

export default LogoutButton;