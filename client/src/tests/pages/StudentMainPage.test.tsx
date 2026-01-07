import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import StudentMainPage from '../../pages/Student/StudentMainPage';
import PagesWithHeader from '../../App';
import { RoleProvider } from '../../navigation/role.config';

vi.mock('../../components/notifications/NotificationParent', () => ({
    default: () => <div>NotificationsMock</div>
}));

describe('StudentMainPage', () => {
    test('renders layout with greeting', () => {
        render(
            <MemoryRouter>
                <StudentMainPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Goedenavond, Hendrik')).toBeInTheDocument();

        const titles = screen.getAllByText('Voorgestelde matches');
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByRole('heading', { name: 'Voorgestelde matches' })).toBeInTheDocument();
    });

    test('opens logout modal when logout button is clicked', () => {
        render(
            <RoleProvider>
                <MemoryRouter initialEntries={["/student"]}>
                    <Routes>
                        <Route element={<PagesWithHeader />}>
                            <Route path="/student" element={<StudentMainPage />} />
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
        render(
            <RoleProvider>
                <MemoryRouter initialEntries={["/student"]}>
                    <Routes>
                        <Route element={<PagesWithHeader />}>
                            <Route path="/student" element={<StudentMainPage />} />
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