import React, { useState } from 'react';
import Header from '../../components/Header';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import Modal from '../../components/Modal';
import WSButton from '../../components/WSButton';
import MatchCard from '../../components/MatchCard';
import Jan from '../../assets/images/jan.png'

const StudentConnections: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Match {
        name: string;
        type: 'connection'
        image: string;
        subjects: string[];
    }

    const matches: Match[] = [
        {
            name: "Jan Hooiberg",
            type: 'connection',
            image: Jan,
            subjects: ["Natuurkunde", "Wiskunde"],
        },
    ];


    return (
        <>
            <Header
                onLogout={() => setIsModalOpen(true)}
            />

            <ScreenLayout
                greeting="Goedenavond, Hendrik"
                rightTitle="Mijn connecties"
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
                            {matches.map((match) => (
                                <MatchCard key={match.name} {...match} />
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
