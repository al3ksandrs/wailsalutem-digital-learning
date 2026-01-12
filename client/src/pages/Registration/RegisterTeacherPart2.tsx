import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import InputField from '../../components/InputField';
import WSButton from '../../components/WSButton';
import ExpandableList from '../../components/ExpandableList';
import '../../css/authentication-screens.css';

interface ExpertiseItem {
    id: number;
    value: string;
}

// harcoded for now, will be imported from db later
const EXPERTISE_OPTIONS = [
    { value: 'Basisschool', label: 'Basisschool' },
    { value: 'VMBO', label: 'VMBO' },
    { value: 'HAVO', label: 'HAVO' },
    { value: 'MBO', label: 'MBO' },
    { value: 'HBO', label: 'HBO' },
    { value: 'Universiteit', label: 'Universiteit' },
];

const RegisterTeacherPart2: React.FC = () => {
    const navigate = useNavigate();

    const [expertiseList, setExpertiseList] = useState<ExpertiseItem[]>([
        { id: 1, value: 'HBO' },
        { id: 2, value: 'Universiteit' }
    ]);

    const handleAdd = () => {
        const newId = Math.max(0, ...expertiseList.map(i => i.id)) + 1;
        setExpertiseList([...expertiseList, { id: newId, value: '' }]);
    };

    const handleRemove = (index: number) => {
        const newList = [...expertiseList];
        newList.splice(index, 1);
        setExpertiseList(newList);
    };

    const handleChange = (index: number, newValue: string) => {
        const newList = [...expertiseList];
        newList[index].value = newValue;
        setExpertiseList(newList);
    };

    const handleNext = () => {
        console.log('Form Data:', expertiseList);
        navigate('/register-teacher-3');
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
                        <span className="auth-step-indicator">
                            2 / 4
                        </span>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>

                        <ExpandableList
                            items={expertiseList}
                            getItemKey={(item) => item.id}
                            onAdd={handleAdd}
                            onRemove={handleRemove}
                            // todo adjust this to be dynamic, based on amount of expertises to select from
                            maxItems={10}
                            renderItem={(item, index) => (
                                <InputField
                                    label="Selecteer jouw expertise"
                                    type="select"
                                    placeholder="Selecteer expertise..."
                                    value={item.value}
                                    options={EXPERTISE_OPTIONS}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                />
                            )}
                        />

                        <div className="columns is-mobile mt-6">
                            <div className="column">
                                <WSButton
                                    label="Terug"
                                    onClick={handleBack}
                                    fullWidth={true}
                                />
                            </div>
                            <div className="column">
                                <WSButton
                                    label="Volgende stap"
                                    onClick={handleNext}
                                    fullWidth={true}
                                />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterTeacherPart2;