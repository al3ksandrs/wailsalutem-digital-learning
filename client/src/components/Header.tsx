import React from 'react';
import NotificationButton from './notifications/NotificationButton';
import LogoutButton from './LogoutButton';
import logo from '../assets/graduation-cap-white.png';
import '../css/header.css';

interface HeaderProps {
    onLogout?: () => void;
    onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onNotificationClick }) => {
    return (
        <header className="topbar">
        <div className="topbar-left">
            <img src={logo} alt="Logo" className="topbar-logo" />
            <nav className="topbar-tabs">
            <button className="topbar-tab">Voorgestelde matches</button>
            <button className="topbar-tab">Mijn verzoeken</button>
            <button className="topbar-tab">Connecties</button>
            </nav>
        </div>

        <div className="topbar-right">
            <NotificationButton count={5} onClick={onNotificationClick} darkMode={true}/>
            <LogoutButton onClick={onLogout} />
        </div>
        </header>
    );
};

export default Header;
