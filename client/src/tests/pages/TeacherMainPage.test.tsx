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

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

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
        expect(screen.getByText('Ma')).toBeInTheDocument();
        expect(screen.getByText('Verstuur')).toBeInTheDocument();
    });

    test('navigate to calendar', () => {
        renderWithProviders(
            <MemoryRouter>
                <TeacherMainPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Kalender'));
        expect(mockNavigate).toHaveBeenCalledWith('/kalender');
    });
});