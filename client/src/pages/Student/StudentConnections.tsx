import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import Modal from '../../components/Modal';
import WSButton from '../../components/WSButton';
import Jan from '../../assets/images/jan.png'
import Connection from '../../components/Connection';
import { useNavigate } from 'react-router-dom';

const StudentConnections: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    function toCalendar() {
        navigate('/kalender');
    }

    interface Connection {
        name: string;
        image: string;
        subjects: string[];
    }

    const students: Connection[] = [
        {
            name: "Jan Hooiberg",
            image: Jan,
            subjects: ["Natuurkunde", "Wiskunde"],
        },
    ];

    return (
        <>
            <ScreenLayout
                greeting="Goedenavond, Hendrik"
                rightTitle="Mijn Connecties"
                leftContent={
                    <div className="student-left-panel">
                        <div className="panel-box">
                            <MainInfoPanel pending={3} matches={12} connections={27} />

                            <WSButton
                                label="Kalender"
                                type="submit"
                                fullWidth={true}
                                size="normal"
                                onClick={() => toCalendar()}
                            />
                        </div>
                    </div>
                }
                rightContent={
                    <div className="student-page-placeholder">
                        <div className="container" style={{ maxWidth: 700 }}>
                            {students.map((student) => (
                                <Connection key={student.name} {...student} />
                            ))}
                        </div>
                    </div>
                }
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Weet je zeker dat je wilt uitloggen?"
            >
                <p>Als je uitlogt, wordt je sessie beëindigd.</p>
            </Modal>
        </>
    );
};

export default StudentConnections;