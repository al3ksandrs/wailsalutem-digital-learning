import React, { useState } from 'react';
import '../css/hamburger-menu.css';

const HamburgerMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        className="hamburger-button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <i className="codicon codicon-menu" aria-hidden="true"></i>
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
            <div className="menu-item">Dashboard</div>
            <div className="menu-item">Mijn matches</div>
            <div className="menu-item">Berichten</div>
            <div className="menu-item">Beschikbaarheid</div>
          </div>

          {/* Close button */}
          <button
            type="button"
            className="menu-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            x
          </button>
        </div>

        <div className="menu-bottom">
          <div className="menu-section-title">Account</div>
          <div className="menu-item">Instellingen</div>
          <div className="menu-item">Uitloggen</div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
