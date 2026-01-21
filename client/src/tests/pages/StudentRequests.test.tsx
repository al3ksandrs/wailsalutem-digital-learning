import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StudentRequests from '../../pages/Student/StudentRequests';
import PagesWithHeader from '../../App';
import { RoleProvider } from '../../navigation/role.config';

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

describe('StudentRequest', () => {
    test('renders layout with greeting', () => {
        renderWithProviders(
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
        renderWithProviders(
            <MemoryRouter>
                <StudentRequests />
            </MemoryRouter>
        );

        expect(screen.getByText('Scheikunde')).toBeInTheDocument();
        expect(screen.getByText('Wiskunde')).toBeInTheDocument();
        expect(screen.getByText('Geschiedenis')).toBeInTheDocument();

        expect(screen.getByText('Amsterdam')).toBeInTheDocument();
        expect(screen.getByText('Alkmaar')).toBeInTheDocument();
        expect(screen.getByText('Amstelveen')).toBeInTheDocument();

    });

    test('opens logout modal when logout button is clicked', () => {
        renderWithProviders(
            <RoleProvider>
                <MemoryRouter initialEntries={["/mijnverzoeken"]}>
                    <Routes>
                        <Route path="/*" element={<PagesWithHeader />}>
                            <Route path="mijnverzoeken" element={<StudentRequests />} />
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
                <MemoryRouter initialEntries={["/mijnverzoeken"]}>
                    <Routes>
                        <Route path="/*" element={<PagesWithHeader />}>
                            <Route path="mijnverzoeken" element={<StudentRequests />} />
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

    test("opens modal to create a new request", () => {
        renderWithProviders(<StudentRequests />);

        const createButton = screen.getByText("Nieuw hulpverzoek");
        fireEvent.click(createButton);

        expect(screen.getByText("Nieuw Hulpverzoek")).toBeInTheDocument();
        expect(screen.getByLabelText("Vak")).toBeInTheDocument();
        expect(screen.getByLabelText("Niveau")).toBeInTheDocument();
    });

    test("creates a new request", () => {
        renderWithProviders(<StudentRequests />);

        fireEvent.click(screen.getByText("Nieuw hulpverzoek"));

        fireEvent.change(screen.getByLabelText("Vak"), {
            target: { value: "Engels" },
        });
        fireEvent.change(screen.getByLabelText("Niveau"), {
            target: { value: "VWO" },
        });
        fireEvent.change(screen.getByLabelText("Locatie"), {
            target: { value: "Utrecht" },
        });
        fireEvent.change(screen.getByLabelText("Extra Informatie"), {
            target: { value: "Dit is extra informatie" },
        });

        fireEvent.click(screen.getByText("Verstuur Verzoek"));
        expect(screen.getByText("Engels")).toBeInTheDocument();
        expect(screen.getByText("Utrecht")).toBeInTheDocument();
    });

    test("open modal to edit request", () => {
        renderWithProviders(<StudentRequests />);

        const editButtons = screen.getAllByLabelText("Edit");
        fireEvent.click(editButtons[0]);

        expect(screen.getByText("Bewerk Hulpverzoek")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Scheikunde")).toBeInTheDocument();
    });

    test("edits an existing request", () => {
        renderWithProviders(<StudentRequests />);

        const editButtons = screen.getAllByLabelText("Edit");
        fireEvent.click(editButtons[0]);
        const subjectSelect = screen.getByLabelText("Vak");
        fireEvent.change(subjectSelect, { target: { value: "Natuurkunde" } });
        fireEvent.click(screen.getByText("Opslaan"));
        expect(screen.getByText("Natuurkunde")).toBeInTheDocument();
    });

    test("deletes a request", () => {
        renderWithProviders(<StudentRequests />);

        const deleteButtons = screen.getAllByLabelText("Delete");
        fireEvent.click(deleteButtons[0]);
        expect(screen.queryByText("Scheikunde")).not.toBeInTheDocument();
    });

    test('navigate to calendar', () => {
        renderWithProviders(
            <MemoryRouter>
                <StudentRequests />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Kalender'));
        expect(mockNavigate).toHaveBeenCalledWith('/kalender');
    });
});