import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import Notifications from '../components/notifications/NotificationParent';
import '../css/student-main.css';
import SubjectTags from '..//components/SubjectTags';

const StudentMainPage: React.FC = () => {
    const Subjects = ['Wiskunde B', 'Natuurkunde', 'Scheikunde', 'Biologie', 'Informatica', 'Engels'];

    return (
        <ScreenLayout
            greeting="Goedenavond, Hendrik"
            rightTitle="Voorgestelde matches"
            leftContent={
                <div className="student-page-placeholder">
                    Hello world :D
                </div>
            }
            rightContent={
                <div className="student-page-placeholder">
                    <div>
                        <Notifications />
                    </div>

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
                    </div>
                    <SubjectTags
                        items={Subjects}
                        maxItems={3}
                        direction="horizontal"
                        showDropdown={true}
                    />
                </div>
            }
        />
    );
};

export default StudentMainPage;