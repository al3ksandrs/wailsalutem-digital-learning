import { fireEvent, render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import StudentCalendar from '../../pages/Student/StudentCalendar';

vi.mock('@fullcalendar/react', () => {
    return {
        __esModule: true,
        default: (props: any) => (
            <div data-testid="fullcalendar">
                <button
                    data-testid="select-date"
                    onClick={() =>
                        props.select({
                            startStr: '2024-01-01T10:00:00',
                            endStr: '2024-01-01T11:00:00',
                            view: { calendar: { unselect: vi.fn() } },
                        })
                    }
                >
                    Select Date
                </button>

                {props.events?.map((event: any) => (
                    <button
                        key={event.id}
                        data-testid="event"
                        onClick={() =>
                            props.eventClick({
                                event: { id: event.id, title: event.title },
                            })
                        }
                    >
                        {event.title}
                    </button>
                ))}
            </div>
        ),
    };
});

describe('StudentCalendar', () => {
    test('renders calendar and modal is closed initially', () => {
        render(<StudentCalendar />);

        expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
        expect(screen.queryByText('Nieuwe Gebeurtenis')).not.toBeInTheDocument();
    });

    test('opens modal when a date is selected', () => {
        render(<StudentCalendar />);

        fireEvent.click(screen.getByTestId('select-date'));
        expect(screen.getByText('Nieuwe Gebeurtenis')).toBeInTheDocument();
    });

    test('adds event when saving with a title', () => {
        render(<StudentCalendar />);

        fireEvent.click(screen.getByTestId('select-date'));
        fireEvent.change(
            screen.getByRole('textbox'),
            { target: { value: 'My Event' } }
        );

        fireEvent.click(screen.getByText('Opslaan'));
        expect(screen.getByText('My Event')).toBeInTheDocument();
    });

    test('does not add event when title is empty', () => {
        render(<StudentCalendar />);

        fireEvent.click(screen.getByTestId('select-date'));
        fireEvent.click(screen.getByText('Opslaan'));
        expect(screen.queryByTestId('event')).not.toBeInTheDocument();
    });

    test('deletes event when confirmed', () => {
        vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

        render(<StudentCalendar />);

        fireEvent.click(screen.getByTestId('select-date'));
        fireEvent.change(
            screen.getByRole('textbox'),
            { target: { value: 'Test' } }
        );

        fireEvent.click(screen.getByText('Opslaan'));
        fireEvent.click(screen.getByText('Test'));
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    test('does not delete event if confirm is canceled', () => {
        vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

        render(<StudentCalendar />);

        fireEvent.click(screen.getByTestId('select-date'));
        fireEvent.change(
            screen.getByRole('textbox'),
            { target: { value: 'Test' } }
        );

        fireEvent.click(screen.getByText('Opslaan'));
        fireEvent.click(screen.getByText('Test'));
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});