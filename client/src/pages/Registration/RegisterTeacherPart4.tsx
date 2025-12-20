import React, { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import InputField from '../../components/InputField';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';

const RegisterTeacherPart4: React.FC = () => {
    const navigate = useNavigate();

    const [bio, setBio] = useState('');
    const [isUploadEnabled, setIsUploadEnabled] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // Handles the checkbox toggle "Upload your CV?"
    const handleToggleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        setIsUploadEnabled(e.target.checked);
        if (!e.target.checked) {
            setUploadedFile(null); 
        }
    };

    // Handles the actual file selection
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    const handleRegister = () => {
        console.log('Bio:', bio);
        console.log('File:', uploadedFile);
        navigate('/register-teacher-waiting'); 
    };

    const handleBack = () => {
        navigate('/register-teacher-3');
    };

    return (
        <div className="page-wrapper bg-auth">
            <div className="auth-wrapper">
                <Logo />

                <div className="login-card">
                    <div className="has-text-centered mb-5">
                        <span className="auth-step-indicator">4 / 4</span>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        
                        {/* Bio Textarea */}
                        <div className="mb-4">
                            <InputField
                                label="Tell us a bit about yourself"
                                type="textarea"
                                rows={5}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="I'm very motivated..."
                            />
                        </div>

                        {/* CV Checkbox Toggle */}
                        <div className="mb-4">
                            <label className="checkbox is-flex is-align-items-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isUploadEnabled} 
                                    onChange={handleToggleUpload}
                                />
                                <span className="has-text-weight-medium">Upload your CV?</span>
                            </label>
                        </div>

                        {/* Conditional Upload Area */}
                        {isUploadEnabled && (
                            <div className="mb-5 fade-in">
                                {!uploadedFile ? (
                                    // Empty Upload State
                                    <div className="file is-boxed is-centered is-fullwidth">
                                        <label className="file-label">
                                            <input 
                                                className="file-input" 
                                                type="file" 
                                                name="resume" 
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                            />
                                            <span className="file-cta has-background-white" style={{ border: '1px solid #3273dc', borderRadius: '8px', padding: '1rem' }}>
                                                <span className="file-icon">
                                                    <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                                                        {/* d="m9,16V10H5 etc basically draws that upload symbol, either keep it like this
                                                        or create a costum component or import a symbol lib" */}
                                                        <path fill="#3273dc" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                                                    </svg>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    // File Selected State 
                                    <div className="box is-flex is-justify-content-space-between is-align-items-center py-3 px-4" style={{ border: '1px solid #dbdbdb', boxShadow: 'none' }}>
                                        <span className="is-size-7 has-text-weight-medium text-truncate">
                                            {uploadedFile.name} 
                                            <span className="has-text-grey ml-1">
                                                ({Math.round(uploadedFile.size / 1024)}K)
                                            </span>
                                        </span>
                                        <button 
                                            type="button"
                                            className="delete has-background-danger" 
                                            onClick={handleRemoveFile}
                                            aria-label="remove file"
                                        ></button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="columns is-mobile mt-6">
                            <div className="column">
                                <WSButton
                                    label="Back"
                                    onClick={handleBack}
                                    fullWidth={true}
                                    type="button"
                                />
                            </div>
                            <div className="column">
                                <WSButton
                                    label="Register"
                                    onClick={handleRegister}
                                    fullWidth={true}
                                    type="submit"
                                />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterTeacherPart4;