import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import LoginRegisterToggle from '../../components/LoginRegisterToggle';
import InputField from '../../components/InputField';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';

const RegisterStep1: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');

    const [role, setRole] = useState('Student / Parent');
    
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNext = () => {
        // common shared registration logic, must be filled in
        if (!email || !password || password !== confirmPassword) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // changes the next registration steps based on selected role
        if (role === 'Teacher') {
            navigate('/register-teacher-2');
        } else {
            navigate('/register-student-2');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/');
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

                    <form onSubmit={(e) => e.preventDefault()}>
                        <InputField
                            label="I am a"
                            type="select"
                            value={role}
                            options={[
                                { value: 'Student / Parent', label: 'Student / Parent' },
                                { value: 'Teacher', label: 'Teacher' }
                            ]}
                            onChange={(e) => setRole(e.target.value)}
                        />

                        <InputField
                            label="Full Name"
                            type="text"
                            placeholder="e.g. Anouk Janssen"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="**********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="mt-6">
                            <WSButton
                                label="Register"
                                onClick={handleNext}
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

export default RegisterStep1;