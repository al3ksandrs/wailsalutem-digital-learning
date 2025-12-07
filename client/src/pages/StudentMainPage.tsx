import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import '../css/student-main.css';

const StudentMainPage: React.FC = () => {
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
                </div>
            }
        />
    );
};

export default StudentMainPage;