import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherMainPage, { DAYS_OF_WEEK } from '../../pages/Teacher/TeacherMainPage';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../components/ScreenLayout', () => ({
    default: ({ leftContent, rightContent }: any) => (
        <div>
            <div data-testid="left">{leftContent}</div>
            <div data-testid="right">{rightContent}</div>
        </div>
    )
}));

vi.mock('../../components/MainInfoPanel', () => ({
    default: (props: any) => (
        <div data-testid="main-info-panel">{JSON.stringify(props)}</div>
    )
}));

vi.mock('../../components/WSButton', () => ({
    default: (props: any) => (
        <button onClick={props.onClick}>{props.label}</button>
    )
}));

vi.mock('../../components/Modal', () => ({
    default: ({ children, isOpen }: any) => (
        isOpen ? <div data-testid="modal">{children}</div> : null
    )
}));

vi.mock('../../components/AvailabilitySlider', () => ({
    default: (props: any) => (
        <div data-testid={`slider-${props.day}`}>
            <button onClick={() => props.onActiveChange(!props.active)}>Toggle {props.day}</button>
            <button onClick={() => props.onChange([10, 18])}>Change {props.day}</button>
        </div>
    )
}));

vi.mock('../../components/MatchCard', () => ({
    default: (props: any) => (
        <div data-testid="match-card">{props.name}</div>
    )
}));

describe('TeacherMainPage', () => {
    const mockNavigate = vi.fn();

    it('renders main layout and panels', () => {
        render(<TeacherMainPage />, { wrapper: MemoryRouter });

        expect(screen.getByTestId('left')).toBeInTheDocument();
        expect(screen.getByTestId('right')).toBeInTheDocument();
        expect(screen.getByText('Kalender')).toBeInTheDocument();
        expect(screen.getByText('Beschikbaarheid')).toBeInTheDocument();
    });

    it('opens and closes the modal', () => {
        render(<TeacherMainPage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByText('Beschikbaarheid'));
        expect(screen.getByTestId('modal')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Verstuur'));
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('updates availability sliders', () => {
        render(<TeacherMainPage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByText('Beschikbaarheid'));

        DAYS_OF_WEEK.forEach(day => {
            fireEvent.click(screen.getByText(`Toggle ${day}`));
            fireEvent.click(screen.getByText(`Change ${day}`));
        });

        fireEvent.click(screen.getByText('Verstuur'));

        expect(screen.getAllByTestId('match-card')).toHaveLength(2);
    });

    it('conditionally renders messages before availability submitted', () => {
        render(<TeacherMainPage />, { wrapper: MemoryRouter });
        expect(screen.getByText(/Er is nog geen beschikbaarheid/i)).toBeInTheDocument();
    });
});
