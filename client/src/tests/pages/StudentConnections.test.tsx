import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StudentConnections from '../../pages/Student/StudentConnections';
import PagesWithHeader from '../../App';
import { RoleProvider } from '../../navigation/role.config';

vi.mock('../../components/notifications/NotificationParent', () => ({
    default: () => <div>NotificationsMock</div>
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

describe('StudentRequest', () => {
    test('renders layout with greeting', () => {
        renderWithProviders(
            <MemoryRouter>
                <StudentConnections />
            </MemoryRouter>
        );
        expect(screen.getByText('Goedenavond, Hendrik')).toBeInTheDocument();

        const titles = screen.getAllByText('Mijn Connecties');
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByRole('heading', { name: 'Mijn Connecties' })).toBeInTheDocument();
    });

    test('renders data', () => {
        renderWithProviders(
            <MemoryRouter>
                <StudentConnections />
            </MemoryRouter>
        );

        expect(screen.getByText('Jan Hooiberg')).toBeInTheDocument();
        expect(screen.getByText('Wiskunde')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    test('opens logout modal when logout button is clicked', () => {
        renderWithProviders(
            <RoleProvider>
                <MemoryRouter initialEntries={["/mijnconnecties"]}>
                    <Routes>
                        <Route path="/*" element={<PagesWithHeader />}>
                            <Route path="mijnconnecties" element={<StudentConnections />} />
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
                <MemoryRouter initialEntries={["/mijnconnecties"]}>
                    <Routes>
                        <Route path="/*" element={<PagesWithHeader />}>
                            <Route path="mijnconnecties" element={<StudentConnections />} />
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
});