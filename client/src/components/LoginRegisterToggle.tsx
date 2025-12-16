import React from 'react';
import '../css/login-register-toggle.css';

interface LoginRegisterToggleProps {
  activeTab: 'login' | 'register';
  onToggle: (tab: 'login' | 'register') => void;
}

const LoginRegisterToggle: React.FC<LoginRegisterToggleProps> = ({ activeTab, onToggle }) => {
  return (
    <div className="auth-toggle-container" role="tablist">
      <button 
        type="button"
        role="tab"
        aria-selected={activeTab === 'login'}
        className={`auth-toggle-item ${activeTab === 'login' ? 'active' : ''}`}
        onClick={() => onToggle('login')}
      >
        Inloggen
      </button>
      <button 
        type="button"
        role="tab"
        aria-selected={activeTab === 'register'}
        className={`auth-toggle-item ${activeTab === 'register' ? 'active' : ''}`}
        onClick={() => onToggle('register')}
      >
        Registreren
      </button>
    </div>
  );
};

export default LoginRegisterToggle;