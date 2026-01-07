import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import Modal from '../../components/Modal';
import WSButton from '../../components/WSButton';
import Request from '../../components/Request';
import Rob from "../../assets/images/rob.png"
import { useNavigate } from 'react-router-dom';

const TeacherRequests: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    function toCalendar() {
        navigate('/kalender');
    }

    interface Request {
        name: string,
        image: string,
        subject: string,
        level: string,
        location: string,
        time: string,
    }

    // Mock Data
    const requests: Request[] = [
        {
            name: "Rob",
            image: Rob,
            subject: "Wiskunde",
            level: "HAVO",
            location: "Amsterdam",
            time: "13:00 - 14:00",
        },
        {
            name: "Rob",
            image: Rob,
            subject: "Scheikunde",
            level: "HAVO",
            location: "Alkmaar",
            time: "12:30 - 13:30",
        }
    ];

    return (
        <>
            <ScreenLayout
                greeting="Goedenavond, Jan"
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
                                onClick={() => toCalendar()}

                            />
                        </div>
                    </div>
                }
                rightContent={
                    <div className="student-page-placeholder">
                        <div className="container overflow" style={{ maxHeight: 450, overflow: "auto" }}>
                            {requests.map((request) => (
                                <Request type={'open'} key={request.name} {...request} />
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

export default TeacherRequests;
