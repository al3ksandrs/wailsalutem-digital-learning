import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../navigation/role.config';
import { NAVIGATION_BY_ROLE } from '../navigation/navigation.config';
import '../css/hamburger-menu.css';
import LogoutButton from './LogoutButton';

interface HamburgerMenuProps {
  onLogout?: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const { role } = useRole();
  const navigation = NAVIGATION_BY_ROLE[role];

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        className="hamburger-button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <i className="codicon codicon-menu" />
      </button>

      {/* Overlay */}
      <button
        type="button"
        className={`menu-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Menu panel */}
      <div className={`menu-panel ${open ? 'open' : ''}`}>
        <div className="menu-top-row">
          <div className="menu-top">
            <div className="menu-section-title">Navigation</div>

            {navigation.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="menu-item"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="menu-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="menu-bottom">
          <div className="menu-section-title">Account</div>
          <LogoutButton onClick={handleLogout} />
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
