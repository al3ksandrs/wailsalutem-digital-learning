import React from 'react';
import LogoutButton from './LogoutButton';
import HamburgerMenu from './HamburgerMenu';
import logo from '../assets/graduation-cap-white.png';
import Notifications from './notifications/NotificationParent';
import '../css/header.css';

interface HeaderProps {
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="topbar">

            {/* MOBILE LEFT: Hamburger */}
            <div className="mobile-left">
                <HamburgerMenu />
            </div>

            {/* DESKTOP LEFT: Logo + tabs */}
            <div className="topbar-left desktop-left">
                <img src={logo} alt="Logo" className="topbar-logo" />
                <nav className="topbar-tabs">
                    <button className="topbar-tab">Voorgestelde matches</button>
                    <button className="topbar-tab">Mijn verzoeken</button>
                    <button className="topbar-tab">Connecties</button>
                </nav>
            </div>

            {/* MOBILE RIGHT: Notifications */}
            <div className="mobile-right">
                <Notifications />
            </div>

            {/* DESKTOP RIGHT: Notifications + Logout */}
            <div className="topbar-right desktop-right">
                <Notifications />
                <LogoutButton onClick={onLogout} />
            </div>

        </header>
    );
};

export default Header;