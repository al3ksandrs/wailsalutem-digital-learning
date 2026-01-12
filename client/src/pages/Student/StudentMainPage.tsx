import React from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import '../../css/student-main.css';
import WSButton from '../../components/WSButton';
import MatchCard from '../../components/MatchCard';

// Mock Data
import Thomas from '../../assets/images/thomas.png';
import Saskia from '../../assets/images/saskia.png';
import { useNavigate } from 'react-router-dom';

const StudentMainPage: React.FC = () => {
    const navigate = useNavigate();

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

    function toCalendar() {
        navigate('/kalender');
    }

    return (
        <ScreenLayout
            greeting="Goedenavond, Hendrik"
            rightTitle="Voorgestelde matches"

            leftContent={
                <div className="student-left-panel">
                    <div className="panel-box">
                        <MainInfoPanel pending={3} matches={2} connections={1} />

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
                    <div className="container" style={{ maxWidth: 700 }}>
                        {matches.map((match) => (
                            <MatchCard key={match.name} {...match} />
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default StudentMainPage;
