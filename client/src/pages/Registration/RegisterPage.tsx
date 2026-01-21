import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import LoginRegisterToggle from '../../components/LoginRegisterToggle';
import InputField from '../../components/InputField';
import WSButton from '../../components/WSButton';
import { validateEmail, validatePassword } from './Validators'
import '../../css/authentication-screens.css';

// Defines a shared type for the event to match InputField's broad signature.
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    // State declarations.
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
    const [role, setRole] = useState('Student / Parent');

    // Form data state declarations.
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Error message state declarations.
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Styles for the error messages to ensure visibility without external CSS changes.
    const errorStyle = {
        color: '#dc3545',
        fontSize: '0.85rem',
        marginTop: '0.25rem',
        marginBottom: '0.5rem',
        display: 'block',
        textAlign: 'left' as const
    };

    // Navigates to the login page.
    const handleLoginRedirect = () => {
        navigate('/');
    };

// Validates the form data and navigates to the next step if successful.
const handleNext = (e: FormEvent) => {
    e.preventDefault();

    // Resets all error messages before validation.
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    // Validates the Full Name.
    if (!fullName.trim()) {
        setFullNameError('Full Name is required.');
        hasError = true;
    }

    // Validates the Email using the industry standard regex.
    const emailValidation = validateEmail({ email });
    if (!emailValidation.isValid) {
        setEmailError(emailValidation.errorMessage);
        hasError = true;
    }

    // Validates the Password using strict security requirements.
    const passwordValidation = validatePassword({ password });
    if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.errorMessage);
        hasError = true;
    }

    // Validates that the Confirm Password matches the Password.
    if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match.');
        hasError = true;
    }

    // Stops execution if validation fails.
    if (hasError) {
        return;
    }

    // Navigates to the specific role registration page.
    if (role === 'Teacher') {
        navigate('/register-teacher-2');
    } else {
        navigate('/register-student-2');
    }
};

return (
    <div className="page-wrapper bg-auth">
        <div className="auth-wrapper">
            <Logo />

            <div className="login-card">
                <div className="has-text-centered mb-4">
                    <span className="auth-step-indicator">Step 1</span>
                </div>

                <div className="mb-5">
                    <LoginRegisterToggle
                        activeTab={activeTab}
                        onToggle={(tab) => tab === 'login' ? handleLoginRedirect() : setActiveTab(tab)}
                    />
                </div>

                <form onSubmit={handleNext}>
                    <InputField
                        label="I am a"
                        type="select"
                        value={role}
                        options={[
                            { value: 'Student / Parent', label: 'Student / Parent' },
                            { value: 'Teacher', label: 'Teacher' }
                        ]}
                        onChange={(e: FormChangeEvent) => setRole(e.target.value)}
                    />

                    <div className="mb-3">
                        <InputField
                            label="Full Name"
                            type="text"
                            placeholder="e.g. Anouk Janssen"
                            value={fullName}
                            onChange={(e: FormChangeEvent) => setFullName(e.target.value)}
                        />
                        {fullNameError && <span style={errorStyle}>{fullNameError}</span>}
                    </div>

                    <div className="mb-3">
                        <InputField
                            label="Email"
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={email}
                            onChange={(e: FormChangeEvent) => setEmail(e.target.value)}
                        />
                        {emailError && <span style={errorStyle}>{emailError}</span>}
                    </div>

                    <div className="mb-3">
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="**********"
                            value={password}
                            onChange={(e: FormChangeEvent) => setPassword(e.target.value)}
                        />
                        {passwordError && <span style={errorStyle}>{passwordError}</span>}
                    </div>

                    <div className="mb-3">
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="**********"
                            value={confirmPassword}
                            onChange={(e: FormChangeEvent) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPasswordError && <span style={errorStyle}>{confirmPasswordError}</span>}
                    </div>

                    <div className="mt-6">
                        <WSButton
                            label="Register"
                            onClick={() => { }}
                            fullWidth={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
);
};

export default RegisterPage;