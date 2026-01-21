import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TeacherMainPage from '../../pages/Teacher/TeacherMainPage';
import { DAYS_OF_WEEK } from '../../pages/Student/StudentRequests';

vi.mock('../../components/notifications/NotificationParent', () => ({
    default: () => <div>NotificationsMock</div>
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

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

const renderWithProviders = (ui: React.ReactNode) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('TeacherMainPage', () => {
    test('renders layout with greeting', () => {
        renderWithProviders(
            <MemoryRouter>
                <TeacherMainPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Goedenavond, Jan')).toBeInTheDocument();

        const titles = screen.getAllByText('Voorgestelde matches');
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByRole('heading', { name: 'Voorgestelde matches' })).toBeInTheDocument();
    });

    test('opens availability modal when clicked', () => {
        renderWithProviders(
            <MemoryRouter>
                <TeacherMainPage />
            </MemoryRouter>
        );

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

    })

    it('conditionally renders messages before availability submitted', () => {
        render(<TeacherMainPage />, { wrapper: MemoryRouter });
        expect(screen.getByText(/Er is nog geen beschikbaarheid/i)).toBeInTheDocument();
    });
});
