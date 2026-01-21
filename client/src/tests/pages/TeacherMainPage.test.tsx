import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PagesWithHeader from '../../App';
import { RoleProvider } from '../../navigation/role.config';
import TeacherMainPage from '../../pages/Teacher/TeacherMainPage';

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

    test('opens logout modal when logout button is clicked', () => {
        renderWithProviders(
            <RoleProvider>
                <MemoryRouter initialEntries={["/docent"]}>
                    <Routes>
                        <Route path="/*" element={<PagesWithHeader />}>
                            <Route path="docent" element={<TeacherMainPage />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            </RoleProvider>
        );

        const logoutBtns = screen.getAllByText('Logout');
        fireEvent.click(logoutBtns.at(-1)!);

        expect(screen.getByText('Weet je zeker dat je wilt uitloggen?')).toBeInTheDocument();
    });

    test('closes logout modal', () => {
        renderWithProviders(
            <RoleProvider>
                <MemoryRouter initialEntries={["/docent"]}>
                    <Routes>
                        <Route path="/*" element={<PagesWithHeader />}>
                            <Route path="docent" element={<TeacherMainPage />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            </RoleProvider>
        );

        const logoutBtns = screen.getAllByText('Logout');
        fireEvent.click(logoutBtns.at(-1)!);

        const closeBtn = document.querySelector('.modal-close');
        expect(closeBtn).toBeInTheDocument();
        fireEvent.click(closeBtn!);

        expect(screen.queryByText('Weet je zeker dat je wilt uitloggen?')).not.toBeInTheDocument();
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
    test('navigate to calendar', () => {
        renderWithProviders(
            <MemoryRouter>
                <TeacherMainPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Verstuur'));

        expect(screen.getAllByTestId('match-card')).toHaveLength(2);
    });

    it('conditionally renders messages before availability submitted', () => {
        render(<TeacherMainPage />, { wrapper: MemoryRouter });
        expect(screen.getByText(/Er is nog geen beschikbaarheid/i)).toBeInTheDocument();
    });
});
