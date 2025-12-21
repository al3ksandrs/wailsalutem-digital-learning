import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';

const RegisterTeacherWaiting: React.FC = () => {
    const navigate = useNavigate();

    const handleSkip = () => {
        navigate('/'); 
    };

    return (
        <div className="page-wrapper bg-auth">
            <div className="auth-wrapper">
                <Logo />

                <div 
                    // these are bulma helpers for center alignment
                    className="login-card has-text-centered is-flex is-flex-direction-column is-justify-content-center" 
                    style={{ minHeight: '400px' }}
                >
                    <div className="mb-6">
                        <h2 className="title is-4 mb-4">Thank you for registering</h2>
                        <p className="subtitle is-6">An admin is working on the request</p>
                    </div>

                    <div className="is-flex is-justify-content-center">
                        <div style={{ width: '200px' }}>
                            <WSButton
                                label="(Return to homepage (login for now))"
                                onClick={handleSkip}
                                fullWidth={true}
                                type="button"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterTeacherWaiting;