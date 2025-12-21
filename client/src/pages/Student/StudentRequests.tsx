import React, { useState } from 'react';
import Header from '../../components/Header';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import Modal from '../../components/Modal';
import WSButton from '../../components/WSButton';
import Request from '../../components/Request';

const StudentMainPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Request {
        subject: string,
        level: string,
        location: string,
        time: string,
    }

    // Mock Data
    const requests: Request[] = [
        {
            subject: "Scheikude",
            level: "HAVO",
            location: "Amsterdam",
            time: "13:00 - 14:00",
        },
        {
            subject: "Wiskunde",
            level: "MAVO",
            location: "Hilversum",
            time: "12:30 - 13:30",
        },
        {
            subject: "Wiskunde",
            level: "MAVO",
            location: "Hilversum",
            time: "12:30 - 13:30",
        },
    ];

    return (
        <>
            <Header
                
                onLogout={() => setIsModalOpen(true)}
            />

            <ScreenLayout
                greeting="Goedenavond, Hendrik"
                rightTitle="Mijn Verzoeken"
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
                        <div className="container overflow" style={{maxHeight: 450, overflow: "auto"}}>
                            {requests.map((request) => (
                                <Request key={request.subject} {...request} />
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
