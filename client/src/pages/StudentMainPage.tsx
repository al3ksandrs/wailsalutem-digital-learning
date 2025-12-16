import React, { useState } from 'react';
import Header from '../components/Header';
import ScreenLayout from '../components/ScreenLayout';
import MainInfoPanel from '../components/MainInfoPanel';
import AvailabilitySlider from '../components/AvailabilitySlider';
import Modal from '../components/Modal';
import '../css/student-main.css';
import SubjectTags from '../components/SubjectTags';
import Achievement from '../components/Achievement';
import BlueCheck from '../assets/badges/blue-check.png';

const StudentMainPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const Subjects = ['Wiskunde B', 'Natuurkunde', 'Scheikunde', 'Biologie', 'Informatica', 'Engels'];

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
                        </div>
                    </div>
                }
                rightContent={
                    <div className="student-page-placeholder">
                        <div>
                            <AvailabilitySlider 
                                day="Maandag"
                                value={[9, 17]}
                                onChange={(val) => console.log('Maandag availability:', val)}
                            />
                        </div>

                        <SubjectTags
                            items={Subjects}
                            maxItems={3}
                            direction="horizontal"
                            showDropdown={true}
                        />

                        <div>
                            <Achievement
                                title="Verified Teacher"
                                description="Verified by a resume."
                                badgeSrc={BlueCheck}
                                progress={45}
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
