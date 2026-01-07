import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import nlLocale from "@fullcalendar/core/locales/nl";
import '../../css/calendar.css';
import type { EventInput } from "@fullcalendar/core";

export type LessonStatus = "available" | "pending" | "booked";

export interface LessonEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    status: LessonStatus;
}

export const toCalendarEvents = (
    lessons: LessonEvent[]
): EventInput[] =>
    lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        start: lesson.start,
        end: lesson.end,
        extendedProps: {
            status: lesson.status
        }
    }));

export default function Calendar() {
    return (
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

                selectable
                selectMirror
            />
        </div>
    );
}
