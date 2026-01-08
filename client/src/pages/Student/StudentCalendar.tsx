import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import nlLocale from "@fullcalendar/core/locales/nl";
import '../../css/calendar.css';
import { useState } from "react";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core/index.js";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import WSButton from "../../components/WSButton";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
}

export default function Calendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [newEventTitle, setNewEventTitle] = useState('');

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setSelectedDates({ start: selectInfo.startStr, end: selectInfo.endStr });
        setNewEventTitle('');
        setIsModalOpen(true);
        selectInfo.view.calendar.unselect();
    };

    const addEvent = () => {
        if (!newEventTitle.trim()) return;

        const newEvent: CalendarEvent = {
            id: "",
            title: newEventTitle,
            start: selectedDates.start,
            end: selectedDates.end,
        };

        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        if (globalThis.confirm(`Delete event '${clickInfo.event.title}'?`)) {
            setEvents(events.filter(event => event.id !== clickInfo.event.id));
        }
    };

    return (
        <>
            <div className="calendar-wrapper">
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "timeGridWeek,timeGridDay"
                    }}
                    slotMinTime="09:00:00"
                    slotMaxTime="20:00:00"
                    locale={nlLocale}
                    allDaySlot={false}
                    nowIndicator={true}
                    height="auto"
                    expandRows={true}
                    weekends={true}
                    selectable={true}
                    select={handleDateSelect}
                    events={events}
                    eventClick={handleEventClick}
                />
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nieuwe Gebeurtenis"
            >
                <form onSubmit={(e) => e.preventDefault()}>

                    <InputField
                        label="Titel"
                        type="text"
                        value={newEventTitle}
                        onChange={e => setNewEventTitle(e.target.value)}
                    />

                    <div className='pt-2 has-text-centered'>
                        <WSButton
                            label="Opslaan"
                            type="submit"
                            size="normal"
                            onClick={addEvent}
                        />
                    </div>
                </form>
            </Modal>
        </>
    );
}

