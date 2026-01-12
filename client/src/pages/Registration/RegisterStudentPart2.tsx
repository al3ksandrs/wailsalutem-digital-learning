import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import InputField from '../../components/InputField';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';

const LEVELS = [
    { value: 'Basisschool', label: 'Basisschool' },
    { value: 'VMBO', label: 'VMBO' },
    { value: 'HAVO', label: 'HAVO' },
    { value: 'VWO', label: 'VWO' },
    { value: 'MBO', label: 'MBO' },
    { value: 'HBO', label: 'HBO' },
    { value: 'Universiteit', label: 'Universiteit' },
];

const PROFILES = [
    { value: 'C&M', label: 'C&M (Cultuur & Maatschappij)' },
    { value: 'E&M', label: 'E&M (Economie & Maatschappij)' },
    { value: 'N&G', label: 'N&G (Natuur & Gezondheid)' },
    { value: 'N&T', label: 'N&T (Natuur & Techniek)' },
];

const RegisterStudentPart2: React.FC = () => {
    const navigate = useNavigate();

    const [level, setLevel] = useState('HAVO');
    const [year, setYear] = useState('1');
    const [profile, setProfile] = useState('');
    const [parentConsent, setParentConsent] = useState(false);

    // Helpers to determine UI state based on Dutch System rules
    const isBasisschool = level === 'Basisschool';
    const isHigherEd = ['MBO', 'HBO', 'Universiteit'].includes(level);
    
    // Profiles are typically chosen in the "Upper School" (Bovenbouw)
    // HAVO: Year 4-5. VWO: Year 4-6.
    const showProfile = 
        (level === 'HAVO' && parseInt(year) >= 4) || 
        (level === 'VWO' && parseInt(year) >= 4);

    // Determines how many years to show in the dropdown based on level
    const getYearOptions = () => {
        let maxYears = 4; // Default VMBO
        if (level === 'HAVO') maxYears = 5;
        if (level === 'VWO') maxYears = 6;
        if (isHigherEd) maxYears = 4; // Arbitrary for higher ed

        return Array.from({ length: maxYears }, (_, i) => ({
            value: (i + 1).toString(),
            label: (i + 1).toString()
        }));
    };

    const handleNext = () => {
        // Pass the level logic to the next step so we show relevant subjects
        navigate('/register-student-3', { state: { level, year, profile } });
    };

    const handleBack = () => {
        navigate('/register');
    };

    return (
        <div className="page-wrapper bg-auth">
            <div className="auth-wrapper">
                <Logo />

                <div className="login-card">
                    <div className="has-text-centered mb-5">
                        <span className="auth-step-indicator">2 / 3</span>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        
                        {/* Level Selection */}
                        <InputField
                            label="Choose Your Level"
                            type="select"
                            value={level}
                            options={LEVELS}
                            onChange={(e) => {
                                setLevel(e.target.value);
                                setYear('1'); // Reset year on level change
                                setProfile('');
                            }}
                        />

                        {/* Year Selection (Hidden for Basisschool) */}
                        {!isBasisschool && (
                            <InputField
                                label="Year"
                                type="select"
                                value={year}
                                options={getYearOptions()}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        )}

                        {/* Profile Selection (Conditional: HAVO 4+ / VWO 4+) */}
                        {showProfile && (
                            <InputField
                                label="Profile"
                                type="select"
                                placeholder="Select Profile..."
                                value={profile}
                                options={PROFILES}
                                onChange={(e) => setProfile(e.target.value)}
                            />
                        )}

                        {/* Parental Consent (Conditional: Basisschool) */}
                        {isBasisschool && (
                            <div className="mb-5 mt-4">
                                <label className="checkbox is-flex is-align-items-start" style={{ gap: '0.75rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={parentConsent} 
                                        onChange={(e) => setParentConsent(e.target.checked)}
                                        style={{ marginTop: '0.25rem' }}
                                    />
                                    <span className="is-size-7 has-text-grey-dark">
                                        I confirm that my parents/guardians agree to the creation of this account.
                                    </span>
                                </label>
                            </div>
                        )}

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
                                    label="Next"
                                    onClick={handleNext}
                                    fullWidth={true}
                                    // Disable if consent is needed but not checked
                                    disabled={isBasisschool && !parentConsent}
                                />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudentPart2;