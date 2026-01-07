import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import '../../css/student-main.css';
import WSButton from '../../components/WSButton';
import '../../css/authentication-screens.css';
import Modal from '../../components/Modal';
import AvailabilitySlider from '../../components/AvailabilitySlider';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    return (
        <ScreenLayout
            greeting="Goedenavond, Jan"
            rightTitle="Voorgestelde matches"

            leftContent={
                <div className="student-left-panel">
                    <div className="panel-box">
                        <MainInfoPanel pending={0} matches={0} connections={2} />

                        <WSButton
                            label="Beschikbaarheid"
                            type="submit"
                            fullWidth={true}
                            size="normal"
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>
            }
            rightContent={
                <div className="student-page-placeholder has-text-centered">
                    <div className="container" style={{ maxWidth: 700 }}>
                        <p>Er is nog geen beschikbaarheid opgegeven.</p>

                        <p>Matches worden pas getoond als er aanwezigheid is opgegeven.</p>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Beschikbaarheid opgeven"
                    >
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="availability-section">
                                {DAYS_OF_WEEK.map((day) => (
                                    <AvailabilitySlider
                                        key={day}
                                        day={day}
                                        active={availability[day].active}
                                        value={availability[day].range}
                                        onActiveChange={(active) =>
                                            setAvailability((prev) => ({
                                                ...prev,
                                                [day]: { ...prev[day], active },
                                            }))
                                        }
                                        onChange={(range) =>
                                            setAvailability((prev) => ({
                                                ...prev,
                                                [day]: { ...prev[day], range },
                                            }))
                                        }
                                    />
                                ))}
                            </div>

                        </form>
                    </Modal>
                </div>
            }

        />
    );
};

export default TeacherMainPage;
