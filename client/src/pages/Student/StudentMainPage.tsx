import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import '../../css/student-main.css';
import WSButton from '../../components/WSButton';
import MatchCard from '../../components/MatchCard';

// Mock Data
import Thomas from '../../assets/images/thomas.png';
import Saskia from '../../assets/images/saskia.png';
import Modal from '../../components/Modal';
import InputField from '../../components/InputField';
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

    const SUBJECTS = [
        { value: 'Nederlands', label: 'Nederlands' },
        { value: 'Engels', label: 'Engels' },
        { value: 'Wiskunde A', label: 'Wiskunde A' },
        { value: 'Wiskunde B', label: 'Wiskunde B' },
        { value: 'Natuurkunde', label: 'Natuurkunde' },
        { value: 'Scheikunde', label: 'Scheikunde' },
        { value: 'Geschiedenis', label: 'Geschiedenis' },
    ];

    const LEVELS = [
        { value: 'Basisschool', label: 'Basisschool' },
        { value: 'VMBO', label: 'VMBO' },
        { value: 'HAVO', label: 'HAVO' },
        { value: 'VWO', label: 'VWO' },
        { value: 'MBO', label: 'MBO' },
        { value: 'HBO', label: 'HBO' },
        { value: 'Universiteit', label: 'Universiteit' },
    ];

    return (
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
                            onClick={() => setIsModalOpen(true)}
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
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title="Nieuw Hulpverzoek"
                        >
                            <form onSubmit={(e) => e.preventDefault()}>

                                {/* Subject Selection */}
                                <InputField
                                    label="Vak"
                                    type="select"
                                    options={SUBJECTS}
                                />
                                {/* Level Selection */}
                                <InputField
                                    label="Niveau"
                                    type="select"
                                    options={LEVELS}
                                />

                                {/* Location Selection */}
                                <InputField
                                    label="Locatie"
                                    type="text"
                                />

                                <p className='custom-label'>Beschikbaarheid</p>
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

                                {/* Additional Information */}
                                <InputField
                                    label="Extra Informatie"
                                    type="textarea"
                                />

                                <div className='pt-2 has-text-centered'>
                                    <WSButton
                                        label="Verstuur Verzoek"
                                        type="submit"
                                        size="normal"
                                    />
                                </div>
                            </form>
                        </Modal>
                    </div>
                </div>
            }
        />
    );
};

export default StudentMainPage;
