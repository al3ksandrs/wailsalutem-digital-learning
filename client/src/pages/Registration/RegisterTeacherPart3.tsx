import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import InputField from '../../components/InputField';
import WSButton from '../../components/WSButton';
import ExpandableList from '../../components/ExpandableList';
import '../../css/authentication-screens.css';

interface SubjectItem {
    id: number;
    value: string;
    isCustom: boolean;
}

const SUBJECT_OPTIONS = [
    { value: 'Math', label: 'Math' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Dutch', label: 'Dutch' },
    { value: 'English', label: 'English' },
];

const RegisterTeacherPart3: React.FC = () => {
    const navigate = useNavigate();

    const [subjectList, setSubjectList] = useState<SubjectItem[]>([
        { id: 1, value: 'Math', isCustom: false },
        { id: 2, value: 'HBO-ICT (Voltijd)', isCustom: true }
    ]);

    const handleAdd = () => {
        const newId = Math.max(0, ...subjectList.map(i => i.id)) + 1;
        setSubjectList([...subjectList, { id: newId, value: '', isCustom: false }]);
    };

    const handleRemove = (index: number) => {
        const newList = [...subjectList];
        newList.splice(index, 1);
        setSubjectList(newList);
    };

    const handleChangeValue = (index: number, newValue: string) => {
        const newList = [...subjectList];
        newList[index].value = newValue;
        setSubjectList(newList);
    };

    const handleToggleCustom = (index: number) => {
        const newList = [...subjectList];
        newList[index].isCustom = !newList[index].isCustom;
        newList[index].value = ''; 
        setSubjectList(newList);
    };

    const handleNext = () => {
        console.log('Selected Subjects:', subjectList);
        navigate('/register-teacher-4');
    };

    const handleBack = () => {
        navigate('/register-teacher-2');
    };

    return (
        <div className="page-wrapper bg-auth">
            <div className="auth-wrapper">
                <Logo />

                <div className="login-card">
                    <div className="has-text-centered mb-5">
                        <span className="auth-step-indicator">
                            3 / 4
                        </span>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>

                        <ExpandableList
                            items={subjectList}
                            getItemKey={(item) => item.id}
                            onAdd={handleAdd}
                            onRemove={handleRemove}
                            maxItems={10}
                            renderItem={(item, index) => {
                                // don't pass 'options' to a text input, might cause the InputField component to crash
                                const isText = item.isCustom;
                                
                                return (
                                    <div className="mb-1">
                                        <InputField
                                            label="Choose Your Subject"
                                            type={isText ? "text" : "select"}
                                            placeholder={isText ? "Enter custom subject..." : "Select subject..."}
                                            value={item.value}
                                            // Only pass options if it is NOT custom
                                            options={isText ? undefined : SUBJECT_OPTIONS}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
                                                handleChangeValue(index, e.target.value)
                                            }
                                        />
                                        
                                        <label 
                                            className="checkbox is-size-7 is-flex is-align-items-center mt-1" 
                                            style={{ width: 'fit-content', cursor: 'pointer' }}
                                        >
                                            <input 
                                                type="checkbox" 
                                                className="mr-2"
                                                checked={item.isCustom}
                                                onChange={() => handleToggleCustom(index)}
                                            />
                                            <span className="has-text-weight-medium">Custom</span>
                                        </label>
                                    </div>
                                );
                            }}
                        />

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
                                />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterTeacherPart3;