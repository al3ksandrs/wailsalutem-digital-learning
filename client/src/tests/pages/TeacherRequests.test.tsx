import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import PagesWithHeader from '../../App';
import { RoleProvider } from '../../navigation/role.config';
import TeacherRequests from '../../pages/Teacher/TeacherRequests';

vi.mock('../../components/notifications/NotificationParent', () => ({
    default: () => <div>NotificationsMock</div>
}));

describe('TeacherMainPage', () => {
    test('renders layout with greeting', () => {
        render(
            <MemoryRouter>
                <TeacherRequests />
            </MemoryRouter>
        );
        expect(screen.getByText('Goedenavond, Jan')).toBeInTheDocument();

        const titles = screen.getAllByText('Mijn Verzoeken');
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByRole('heading', { name: 'Mijn Verzoeken' })).toBeInTheDocument();
    });

    test('opens logout modal when logout button is clicked', () => {
        render(
            <RoleProvider>
                <MemoryRouter initialEntries={["/studentverzoeken"]}>
                    <Routes>
                        <Route element={<PagesWithHeader />}>
                            <Route path="/studentverzoeken" element={<TeacherRequests />} />
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
                <MemoryRouter initialEntries={["/studentverzoeken"]}>
                    <Routes>
                        <Route element={<PagesWithHeader />}>
                            <Route path="/studentverzoeken" element={<TeacherRequests />} />
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