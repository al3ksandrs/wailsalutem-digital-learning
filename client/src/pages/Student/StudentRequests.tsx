import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '../../components/ScreenLayout';
import MainInfoPanel from '../../components/MainInfoPanel';
import WSButton from '../../components/WSButton';
import Modal from '../../components/Modal';
import InputField from '../../components/InputField';
import AvailabilitySlider from '../../components/AvailabilitySlider';
import Request from '../../components/Request';

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
]

interface RequestType {
  id: number;
  image: string;
  subject: string;
  level: string;
  location: string;
  time: string;
  extraInfo?: string;
}

interface DayAvailability {
  active: boolean;
  range: number[];
}

type WeeklyAvailability = Record<DayOfWeek, DayAvailability>;

const defaultRange: number[] = [9, 17];

const SUBJECTS = [
  { value: "Nederlands", label: "Nederlands" },
  { value: "Engels", label: "Engels" },
  { value: "Wiskunde A", label: "Wiskunde A" },
  { value: "Wiskunde B", label: "Wiskunde B" },
  { value: "Natuurkunde", label: "Natuurkunde" },
  { value: "Scheikunde", label: "Scheikunde" },
  { value: "Geschiedenis", label: "Geschiedenis" },
];

const LEVELS = [
  { value: "Basisschool", label: "Basisschool" },
  { value: "VMBO", label: "VMBO" },
  { value: "HAVO", label: "HAVO" },
  { value: "VWO", label: "VWO" },
  { value: "MBO", label: "MBO" },
  { value: "HBO", label: "HBO" },
  { value: "Universiteit", label: "Universiteit" },
];

const StudentRequests: React.FC = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<RequestType[]>([
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RequestType | null>(null);

  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    location: "",
    extraInfo: "",
  });

  const [availability, setAvailability] = useState<WeeklyAvailability>(() =>
    DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = { active: false, range: defaultRange };
      return acc;
    }, {} as WeeklyAvailability)
  );

  useEffect(() => {
    if (currentRequest) {
      setFormData({
        subject: currentRequest.subject,
        level: currentRequest.level,
        location: currentRequest.location,
        extraInfo: currentRequest.extraInfo || "",
      });
    } else {
      setFormData({ subject: "", level: "", location: "", extraInfo: "" });
      setAvailability(
        DAYS_OF_WEEK.reduce((acc, day) => {
          acc[day] = { active: false, range: defaultRange };
          return acc;
        }, {} as WeeklyAvailability)
      );
    }
  }, [currentRequest]);

  const openCreateModal = () => {
    setCurrentRequest(null);
    setIsModalOpen(true);
  };

  const openEditModal = (request: RequestType) => {
    setCurrentRequest(request);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (currentRequest) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === currentRequest.id ? { ...r, ...formData } : r
        )
      );
    } else {
      const newRequest: RequestType = {
        id: Date.now(),
        image: "",
        time: "12:00 - 13:00",
        ...formData,
      };
      setRequests((prev) => [...prev, newRequest]);
    }
    setIsModalOpen(false);
  };

  const deleteRequest = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const toCalendar = () => {
    navigate("/kalender");
  };

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
                fullWidth
                size="normal"
                onClick={toCalendar}
              />

              <WSButton
                label="Nieuw hulpverzoek"
                type="submit"
                fullWidth
                size="normal"
                onClick={openCreateModal}
              />
            </div>
          </div>
        }
        rightContent={
          <div className="student-page-placeholder">
            <div
              className="container overflow"
              style={{ maxHeight: 450, overflow: "auto" }}
            >
              {requests.map((request) => (
                <Request
                  type="student"
                  key={request.id}
                  {...request}
                  onEdit={() => openEditModal(request)}
                  onDelete={() => deleteRequest(request.id)}
                />
              ))}
            </div>
          </div>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRequest ? "Bewerk Hulpverzoek" : "Nieuw Hulpverzoek"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <InputField
            label="Vak"
            type="select"
            options={SUBJECTS}
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          />
          <InputField
            label="Niveau"
            type="select"
            options={LEVELS}
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
          />
          <InputField
            label="Locatie"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />

          <p className="custom-label">Beschikbaarheid</p>
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

          <InputField
            label="Extra Informatie"
            type="textarea"
            value={formData.extraInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, extraInfo: e.target.value }))}
          />

          <div className="pt-2 has-text-centered">
            <WSButton
              label={currentRequest ? "Opslaan" : "Verstuur Verzoek"}
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