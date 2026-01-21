import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';
import { useRole } from '../../navigation/role.config';

const RegisterTeacherWaiting: React.FC = () => {
    const { setRole } = useRole();
    const navigate = useNavigate();

    const handleSkip = () => {
        setRole("teacher");
        navigate('/docent'); 
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
                        <h2 className="title is-4 mb-4 has-text-black">Thank you for registering</h2>
                        <p className="title is-6 has-text-black">An admin is working on the request</p>
                    </div>

                    <div className="is-flex is-justify-content-center">
                        <div style={{ width: '200px' }}>
                            <WSButton
                                label="(skip to teacher dashboard)"
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