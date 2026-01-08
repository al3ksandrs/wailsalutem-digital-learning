import React, { useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import Modal from '../../components/Modal';
import WSButton from '../../components/WSButton';
import Request from '../../components/Request';
import { useNavigate } from 'react-router-dom';
import AvailabilitySlider from '../../components/AvailabilitySlider';
import InputField from '../../components/InputField';

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

const StudentRequests: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Request {
        id: number,
        image: string,
        subject: string,
        level: string,
        location: string,
        time: string,
    }

    // Mock Data
    const [requests, setRequests] = useState<Request[]>([
        {
            id: 1,
            image: "",
            subject: "Scheikunde",
            level: "HAVO",
            location: "Amsterdam",
            time: "13:00 - 14:00",
        },
        {
            id: 2,
            image: "",
            subject: "Wiskunde",
            level: "HAVO",
            location: "Alkmaar",
            time: "12:30 - 13:30",
        },
        {
            id: 3,
            image: "",
            subject: "Geschiedenis",
            level: "HAVO",
            location: "Amstelveen",
            time: "11:45 - 12:25",
        },
    ]);

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

    function toCalendar() {
        navigate('/kalender');
    }

    function deleteRequest(requestId: number) {
        setRequests(prev =>
            prev.filter(request => request.id !== requestId)
        );
    }

    return (
        <>
            <ScreenLayout
                greeting="Goedenavond, Hendrik"
                rightTitle="Mijn Verzoeken"
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
                        <div className="container overflow" style={{ maxHeight: 450, overflow: "auto" }}>
                            {requests.map((request) => (
                                <Request type='student' key={request.id} onEdit={() => setIsModalOpen(true)} onDelete={() => deleteRequest(request.id)} {...request} />
                            ))}
                        </div>
                    </div>
                }
            />

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
        </>
    );
};

export default StudentRequests;