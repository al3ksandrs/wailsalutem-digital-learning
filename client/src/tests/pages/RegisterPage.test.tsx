import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterPart1 from '../../pages/Registration/RegisterPage';

// Mocks the navigation hook.
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
        // Mocks window alert to prevent errors during validation tests.
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    test('should render registration fields via placeholders', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);

        // ASSERT
        expect(screen.getByPlaceholderText(/e.g. Anouk Janssen/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/e.g. name@example.com/i)).toBeInTheDocument();
    });

    test('should navigate to student step 2 when form is valid', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);

        // ACT
        fireEvent.change(screen.getByPlaceholderText(/e.g. name@example.com/i), { target: { value: 'student@test.com' } });
        const passwords = screen.getAllByPlaceholderText('**********');
        fireEvent.change(passwords[0], { target: { value: 'password123' } });
        fireEvent.change(passwords[1], { target: { value: 'password123' } });
        
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/register-student-2');
    });

    test('should redirect to login when Dutch toggle is clicked', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterPart1 /></MemoryRouter>);

        // ACT - Targets the Dutch translation used in the component.
        const loginToggle = screen.getByText(/Inloggen/i);
        fireEvent.click(loginToggle);

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});