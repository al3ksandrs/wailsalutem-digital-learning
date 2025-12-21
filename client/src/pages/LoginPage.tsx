import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import LoginRegisterToggle from '../components/LoginRegisterToggle';
import InputField from '../components/InputField';
import WSButton from '../components/WSButton';
import '../css/authentication-screens.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    navigate('/student');
  };

  const handleToggle = (tab: 'login' | 'register') => {
    if (tab === 'register') {
      navigate('/register');
    } else {
      setActiveTab(tab);
    }
  };

  function handlePasswordReset() {
    navigate('/resetpassword');
  }

  return (
    <div className="page-wrapper bg-auth">
      <div className="auth-wrapper">
        <Logo />
        <div className="login-card">
          <LoginRegisterToggle
            activeTab={activeTab}
            onToggle={handleToggle}
          />
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <InputField
                label="Email"
                type="email"
                placeholder="email@address.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <InputField
                label="Wachtwoord"
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <WSButton
              label="Inloggen"
              type="submit"
              fullWidth={true}
              size="normal"
            />

            <div className='mt-2 has-text-centered' onClick={handlePasswordReset}>
              <a>Wachtwoord vergeten?</a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;