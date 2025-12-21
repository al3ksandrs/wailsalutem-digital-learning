import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import RegisterPart1 from '../../pages/Registration/RegisterPage';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterPart1', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    test('renders correctly and allows input changes', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);
        const nameInput = screen.getByPlaceholderText(/e.g. Anouk Janssen/i);
        
        // ACT
        fireEvent.change(nameInput, { target: { value: 'Test User' } });

        // ASSERT
        expect(nameInput).toHaveValue('Test User');
    });

    test('shows alert if fields are missing (Validation Branch)', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);
        const registerBtn = screen.getByRole('button', { name: /Register/i });

        // ACT - Submit without filling fields
        fireEvent.click(registerBtn);

        // ASSERT
        expect(window.alert).toHaveBeenCalledWith("Please fill in all fields correctly.");
    });

    test('shows alert if passwords do not match (Logic Branch)', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);
        const passwords = screen.getAllByPlaceholderText('**********');

        // ACT
        fireEvent.change(screen.getByPlaceholderText(/e.g. name@example.com/i), { target: { value: 't@t.com' } });
        fireEvent.change(passwords[0], { target: { value: 'password123' } });
        fireEvent.change(passwords[1], { target: { value: 'different' } });
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        // ASSERT
        expect(window.alert).toHaveBeenCalledWith("Please fill in all fields correctly.");
    });

    test('navigates to teacher-2 when Teacher role is selected (Role Branch)', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);

        // ACT
        // Changes role to Teacher
        fireEvent.change(screen.getByDisplayValue(/Student/i), { target: { value: 'Teacher' } });
        
        // Fills valid data
        fireEvent.change(screen.getByPlaceholderText(/e.g. name@example.com/i), { target: { value: 't@t.com' } });
        const p = screen.getAllByPlaceholderText('**********');
        fireEvent.change(p[0], { target: { value: '123' } });
        fireEvent.change(p[1], { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/register-teacher-2');
    });

    test('redirects to home when login toggle is clicked', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);

        // ACT
        fireEvent.click(screen.getByText(/Inloggen/i));

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});