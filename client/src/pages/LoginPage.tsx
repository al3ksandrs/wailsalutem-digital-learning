import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import LoginRegisterToggle from '../components/LoginRegisterToggle';
import InputField from '../components/InputField';
import WSButton from '../components/WSButton';
import { useLogin } from '../services/authService';
import '../css/authentication-screens.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auth Hook
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Vul alsjeblieft alle velden in.");
      return;
    }

    loginMutation.mutate(
      { email, password }, 
      {
        onSuccess: (user) => {
          console.log('Login successful:', user);
          
          // Role-based redirect Logic
          if (user.role === 'Admin') {
            navigate('/admin');
          } else if (user.role === 'Teacher') {
            // Checks if teacher is approved
            if (user.status === 'Pending') {
              navigate('/register-teacher-waiting');
            } else {
              navigate('/docent');
            }
          } else if (user.role === 'Student') {
            navigate('/student');
          } else {
            // Fallback
            navigate('/student');
          }
        },
        onError: (error) => {
          console.error('Login error:', error);
          setErrorMessage(error.message || 'Inloggen mislukt. Controleer je gegevens.');
        }
      }
    );
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
            
            {/* Error message display */}
            {errorMessage && (
              <div style={{ 
                color: 'var(--error-color, #dc3545)', 
                marginBottom: '1rem', 
                textAlign: 'center',
                fontSize: '0.9em' 
              }}>
                {errorMessage}
              </div>
            )}

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
              label={loginMutation.isPending ? "Bezig met inloggen..." : "Inloggen"}
              type="submit"
              fullWidth={true}
              size="normal"
              disabled={loginMutation.isPending}
            />

            <div className='has-text-centered'>
              <button
                type="button"
                className="mt-2 link-button"
                onClick={handlePasswordReset}
              >
                Wachtwoord vergeten?
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;