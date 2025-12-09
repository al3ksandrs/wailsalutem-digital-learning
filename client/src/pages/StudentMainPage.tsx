import React, { useState } from 'react';
import Header from '../components/Header';
import ScreenLayout from '../components/ScreenLayout';
import Notifications from '../components/notifications/NotificationParent';
import MainInfoPanel from '../components/MainInfoPanel';
import LogoutButton from '../components/LogoutButton';
import AvailabilitySlider from '../components/AvailabilitySlider';
import Modal from '../components/Modal';
import '../css/student-main.css';

const StudentMainPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <><Header></Header>
            <ScreenLayout
                greeting="Goedenavond, Hendrik"
                rightTitle="Voorgestelde matches"
                leftContent={
                    <div className="student-left-panel">
                        <div className="panel-box">
                            <MainInfoPanel pending={3} matches={12} connections={27} />
                        </div>
                        <LogoutButton onClick={() => setIsModalOpen(true)} />
                    </div>
                }
                rightContent={
                    <div className="student-page-placeholder">
                        <Notifications />

                        Hello world :D
                        Hello world :D
                        Hello world :D
                        Hello world :D
                        Hello world :D
                        Hello world :D
                        Hello world :D
                        <div>
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                        </div>
                        <div>
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                        </div>
                        <div>
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                            Hello world :D
                                <AvailabilitySlider 
                                    day="Maandag"
                                    value={[9, 17]}
                                    onChange={(val) => console.log('Maandag availability:', val)}
                                />
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
