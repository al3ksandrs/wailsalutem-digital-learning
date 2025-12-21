import React, { useState } from 'react';
import Header from '../components/Header';
import ScreenLayout from '../components/ScreenLayout';
import MainInfoPanel from '../components/MainInfoPanel';
import Modal from '../components/Modal';
import '../css/student-main.css';
import WSButton from '../components/WSButton';
import MatchCard from '../components/MatchCard';

// Mock Data
import Thomas from '../assets/images/thomas.png';
import Saskia from '../assets/images/saskia.png';

const StudentMainPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Match {
        name: string;
        image: string;
        subjects: string[];
    }

    const matches: Match[] = [
        {
            name: "Thomas de Jong",
            image: Thomas,
            subjects: ["Biology"],
        },
        {
            name: "Saskia Veermans",
            image: Saskia,
            subjects: ["English", "History"],
        },
    ];


    return (
        <>
            <Header
                onLogout={() => setIsModalOpen(true)}
            />

            <ScreenLayout
                greeting="Goedenavond, Hendrik"
                rightTitle="Voorgestelde matches"
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

export default StudentMainPage;
