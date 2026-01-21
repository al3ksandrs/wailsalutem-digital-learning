import { useState } from 'react';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import WSButton from '../components/WSButton';
import '../css/authentication-screens.css';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="page-wrapper bg-auth">
      <div className="auth-wrapper">
        <Logo />
        <div className="login-card">
          <form>
            <div className="mb-5">
              <h1 className="title has-text-centered has-text-black">Wachtwoord vergeten</h1>
              <p className='mb-2 mt-2'>Voeg je emailadres toe om een link te krijgen om je wachtwoord te resetten.</p>
              <InputField
                label="Email"
                type="email"
                placeholder="email@address.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <WSButton
              label="Verstuur"
              type="submit"
              fullWidth={true}
              size="normal"
            />

            <div className='has-text-centered mt-4' >
              <Link to={"/"}>Terug naar login</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;