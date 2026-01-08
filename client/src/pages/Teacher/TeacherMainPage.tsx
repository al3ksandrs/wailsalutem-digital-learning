import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import '../../css/student-main.css';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';
import Modal from '../../components/Modal';
import AvailabilitySlider from '../../components/AvailabilitySlider';
import Anon from '../../assets/images/Anon.png'
import { useNavigate } from 'react-router-dom';
import Connection from '../../components/Connection';

export type DayOfWeek =
    | "Ma"
    | "Di"
    | "Wo"
    | "Do"
    | "Vr"
    | "Za"
    | "Zo";

export const DAYS_OF_WEEK: DayOfWeek[] = [
    "Ma",
    "Di",
    "Wo",
    "Do",
    "Vr",
    "Za",
    "Zo",
];

const TeacherMainPage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAvailabilitySubmitted, setNewAvailability] = useState(false);

    interface DayAvailability {
        active: boolean;
        range: number[];
    }

    type WeeklyAvailability = Record<DayOfWeek, DayAvailability>;

    const defaultRange: number[] = [9, 17];

    const [availability, setAvailability] = useState<WeeklyAvailability>(() =>
        DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day] = { active: false, range: defaultRange };
            return acc;
        }, {} as WeeklyAvailability)
    );

    interface Connection {
        id: number;
        name: string;
        image: string;
        subjects: string[];
    }

    const students: Connection[] = [
        {
            id: 1,
            name: "Student 1",
            image: Anon,
            subjects: ["Natuurkunde"],
        },
        {
            id: 2,
            name: "Student 2",
            image: Anon,
            subjects: ["Wiskunde"],
        },
    ];

    function toCalendar() {
        navigate('/kalender');
    }

    return (
        <ScreenLayout
            greeting="Goedenavond, Jan"
            rightTitle="Voorgestelde matches"

            leftContent={
                <div className="student-left-panel">
                    <div className="panel-box">
                        <MainInfoPanel pending={0} matches={0} connections={2} />

                        <WSButton
                            label="Kalender"
                            type="submit"
                            fullWidth={true}
                            size="normal"
                            onClick={toCalendar}
                        />

                        {!isAvailabilitySubmitted && (
                            <WSButton
                                label="Beschikbaarheid"
                                type="button"
                                fullWidth={true}
                                size="normal"
                                onClick={() => setIsModalOpen(true)}
                            />
                        )}
                    </div>
                </div>
            }
            rightContent={
                <div className="student-page-placeholder has-text-centered">
                    <div className="container" style={{ maxWidth: 700 }}>
                        {!isAvailabilitySubmitted && (
                            <><p>Er is nog geen beschikbaarheid opgegeven.</p><p>Matches worden pas getoond als er aanwezigheid is opgegeven.</p></>
                        )}
                        {isAvailabilitySubmitted && (
                            students.map((student) => (
                                <Connection key={student.name} {...student} />
                            ))
                        )}

                    </div>

                    <Modal
                        title="Beschikbaarheid opgeven"
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}

                    >
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="availability-section">
                                {DAYS_OF_WEEK.map((day) => (
                                    <AvailabilitySlider
                                        day={day}
                                        key={day}
                                        active={availability[day].active}
                                        value={availability[day].range}
                                        onChange={(range) =>
                                            setAvailability((prev) => ({
                                                ...prev,
                                                [day]: { ...prev[day], range },
                                            }))
                                        }
                                        onActiveChange={(active) =>
                                            setAvailability((prev) => ({
                                                ...prev,
                                                [day]: { ...prev[day], active },
                                            }))
                                        }
                                    />
                                ))}
                                <WSButton
                                    label="Verstuur"
                                    type="submit"
                                    size="normal"
                                    onClick={() => {
                                        setNewAvailability(true);
                                        setIsModalOpen(false);
                                    }}
                                />
                            </div>

                        </form>
                    </Modal>
                </div>
            }

        />
    );
};

export default TeacherMainPage;
