import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterTeacherPart2 from '../../pages/Registration/RegisterTeacherPart2';

// Mocks the navigation hook.
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

describe('RegisterTeacherPart2', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Spies on console.log to cover the line inside handleNext.
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    test('should render the initial expertise items correctly', () => {
        // ARRANGE
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );

        // ASSERT
        // Checks the default state of the expertise list.
        expect(screen.getByDisplayValue('HBO')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Universiteit')).toBeInTheDocument();
    });

    test('should add a new expertise line when the add button is clicked', () => {
        // ARRANGE
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );
        const addButton = screen.getByLabelText(/Add new item/i);

        // ACT
        fireEvent.click(addButton);

        // ASSERT
        // Initial 2 items + 1 new = 3 selects.
        const selects = screen.getAllByRole('combobox');
        expect(selects).toHaveLength(3);
    });

    test('should update the value of an expertise item when changed', () => {
        // ARRANGE
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );
        const firstSelect = screen.getByDisplayValue('HBO');

        // ACT
        fireEvent.change(firstSelect, { target: { value: 'VMBO' } });

        // ASSERT
        expect(firstSelect).toHaveValue('VMBO');
    });

    test('should remove an expertise item when the remove button is clicked', () => {
        // ARRANGE
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );
        const removeButtons = screen.getAllByLabelText(/Remove item/i);

        // ACT
        fireEvent.click(removeButtons[0]);

        // ASSERT
        expect(screen.queryByDisplayValue('HBO')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Universiteit')).toBeInTheDocument();
    });

    test('should log data and navigate to part 3 on next click', () => {
        // ARRANGE
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );
        const nextBtn = screen.getByText(/Volgende stap/i);

        // ACT
        fireEvent.click(nextBtn);

        // ASSERT
        expect(console.log).toHaveBeenCalledWith('Form Data:', expect.any(Array));
        expect(mockNavigate).toHaveBeenCalledWith('/register-teacher-3');
    });

    test('should navigate back to the main register page on back click', () => {
        // ARRANGE
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );
        const backBtn = screen.getByText(/Terug/i);

        // ACT
        fireEvent.click(backBtn);

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});