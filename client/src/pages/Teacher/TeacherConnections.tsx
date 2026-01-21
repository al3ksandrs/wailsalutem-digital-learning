import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import Modal from '../../components/Modal';
import WSButton from '../../components/WSButton';
import Rob from '../../assets/images/rob.png';
import Connection from '../../components/Connection';
import { useNavigate } from 'react-router-dom';


const TeacherConnections: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Connection {
        id: number;
        name: string;
        image: string;
    }

    const connections: Connection[] = [
        {
            id: 1,
            name: "Rob",
            image: Rob,
        },
    ];

    function toCalendar() {
        navigate('/kalender');
    }

    return (
        <>
            <ScreenLayout
                greeting="Goedenavond, Jan"
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
                                onClick={toCalendar}
                            />
                        </div>
                    </div>
                }
                rightContent={
                    <div className="panel-box" style={{ maxWidth: 700 }}>
                        {connections.map((connection) => (
                            <Connection subjects={[]} key={connection.name} {...connection} />
                        ))}
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

export default TeacherConnections;