import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';
import { useRole } from '../../navigation/role.config';

// A mix of subjects to match your screenshot
const ALL_SUBJECTS = [
    'Dutch', 'English', 'Math', 'History', 
    'Geography', 'Biology', 'Physics', 'Chemistry', 
    'Economics', 'Business Economics', 'German', 'French', 
    'Spanish', 'Computer Science', 'Philosophy'
];

const RegisterStudentPart3: React.FC = () => {
    const { setRole } = useRole();
    const navigate = useNavigate();

    // In a real app, use this data to filter subjects (e.g., C&M profile implies History/Art)
    // const { level, year, profile } = location.state || {}; 

    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['German', 'Economics']);

    const toggleSubject = (subject: string) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
        } else {
            setSelectedSubjects([...selectedSubjects, subject]);
        }
    };

    const handleRegister = () => {
        console.log('Registration Complete:', selectedSubjects);
        // Navigate to the Success/Waiting page you already have
        setRole("student");
        navigate('/student'); // Or create a specific student success page if needed
    };

    const handleBack = () => {
        navigate('/register-student-2');
    };

    return (
        <div className="page-wrapper bg-auth">
            <div className="auth-wrapper">
                <Logo />

                <div className="login-card">
                    <div className="has-text-centered mb-5">
                        <span className="auth-step-indicator">3 / 3</span>
                    </div>

                    <h3 className="title is-6 mb-4">Choose Your Subjects</h3>

                    {/* Subject Pill Grid */}
                    <div className="columns is-multiline is-mobile variable-is-1 mb-5">
                        {ALL_SUBJECTS.map((subject) => {
                            const isSelected = selectedSubjects.includes(subject);
                            return (
                                <div key={subject} className="column is-6">
                                    <button
                                        type="button"
                                        onClick={() => toggleSubject(subject)}
                                        className={`button is-fullwidth is-normal ${isSelected ? 'is-link' : 'is-light'}`}
                                        style={{ 
                                            justifyContent: 'space-between',
                                            transition: 'all 0.2s',
                                            border: 'none'
                                        }}
                                    >
                                        {/* Checkmark icon (only visible when selected) */}
                                        <span className="icon is-small" style={{ opacity: isSelected ? 1 : 0 }}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </span>
                                        
                                        <span className="has-text-weight-medium is-size-7">{subject}</span>
                                        
                                        {/* Empty span for spacing balance */}
                                        <span className="icon is-small"></span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="columns is-mobile mt-6">
                        <div className="column">
                            <WSButton
                                label="Back"
                                onClick={handleBack}
                                fullWidth={true}
                            />
                        </div>
                        <div className="column">
                            <WSButton
                                label="Register"
                                onClick={handleRegister}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudentPart3;