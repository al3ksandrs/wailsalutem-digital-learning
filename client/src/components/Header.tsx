import React from 'react';
import LogoutButton from './LogoutButton';
import HamburgerMenu from './HamburgerMenu';
import logo from '../assets/graduation-cap-white.png';
import Notifications from './notifications/NotificationParent';
import '../css/header.css';
import { Link } from 'react-router-dom';
import { useRole } from '../navigation/role.config';
import { NAVIGATION_BY_ROLE } from '../navigation/navigation.config';

interface HeaderProps {
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const { role } = useRole();
    const navigation = NAVIGATION_BY_ROLE[role];

    return (
        <header className="topbar">

            {/* MOBILE LEFT: Hamburger */}
            <div className="mobile-left">
                <HamburgerMenu onLogout={onLogout} />
            </div>

            {/* DESKTOP LEFT: Logo + tabs */}
            <div className="topbar-left desktop-left">
                <img src={logo} alt="Logo" className="topbar-logo" />
                <nav className="topbar-tabs">
                    {navigation.map((item) => (
                        <div key={item.path}>
                            <Link className='topbar-tab' to={item.path}>{item.label}</Link>
                        </div>
                    ))}
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