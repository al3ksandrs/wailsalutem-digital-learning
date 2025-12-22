import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import StudentRequests from '../../pages/Student/StudentRequests';
import PagesWithHeader from '../../App';

vi.mock('../../components/notifications/NotificationParent', () => ({
    default: () => <div>NotificationsMock</div>
}));

describe('StudentRequest', () => {
    test('renders layout with greeting', () => {
        render(
            <MemoryRouter>
                <StudentRequests />
            </MemoryRouter>
        );
        expect(screen.getByText('Goedenavond, Hendrik')).toBeInTheDocument();

        const titles = screen.getAllByText('Mijn Verzoeken');
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByRole('heading', { name: 'Mijn Verzoeken' })).toBeInTheDocument();
    });

    test('renders data', () => {

        render(<StudentRequests />);

        expect(screen.getByText('Scheikude')).toBeInTheDocument();
        expect(screen.getByText('Wiskunde')).toBeInTheDocument();
        expect(screen.getByText('Geschiedenis')).toBeInTheDocument();

        expect(screen.getByText('Amsterdam')).toBeInTheDocument();
        expect(screen.getByText('Alkmaar')).toBeInTheDocument();
        expect(screen.getByText('Amstelveen')).toBeInTheDocument();

    });

    test('opens logout modal when logout button is clicked', () => {
        render(
            <MemoryRouter initialEntries={["/verzoeken"]}>
                <Routes>
                    <Route element={<PagesWithHeader />}>
                        <Route path="/verzoeken" element={<StudentRequests />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        const logoutBtns = screen.getAllByText('Logout');
        fireEvent.click(logoutBtns.at(-1)!);

        expect(screen.getByText('Weet je zeker dat je wilt uitloggen?')).toBeInTheDocument();
    });

    test('closes logout modal', () => {
        render(
            <MemoryRouter initialEntries={["/verzoeken"]}>
                <Routes>
                    <Route element={<PagesWithHeader />}>
                        <Route path="/verzoeken" element={<StudentRequests />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        const logoutBtns = screen.getAllByText('Logout');
        fireEvent.click(logoutBtns.at(-1)!);

        const closeBtn = document.querySelector('.modal-close');
        expect(closeBtn).toBeInTheDocument();
        fireEvent.click(closeBtn!);

        expect(screen.queryByText('Weet je zeker dat je wilt uitloggen?')).not.toBeInTheDocument();
    });
});