import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import Modal from '../../components/Modal';
import WSButton from '../../components/WSButton';
import Thomas from '../../assets/images/thomas.png';
import Connection from '../../components/Connection';

const TeacherConnections: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Connection {
        name: string;
        image: string;
        subjects: string[]
    }

    const connections: Connection[] = [
        {
            name: "Thomas",
            image: Thomas,
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
                            />

                            <WSButton
                                label="Nieuw hulpverzoek"
                                type="submit"
                                fullWidth={true}
                                size="normal"
                            />
                        </div>
                    </div>
                }
                rightContent={
                    <div className="student-page-placeholder">
                        <div className="container" style={{ maxWidth: 700 }}>
                            {connections.map((connection) => (
                                <Connection subjects={[]} key={connection.name} {...connection} />
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

export default TeacherConnections;