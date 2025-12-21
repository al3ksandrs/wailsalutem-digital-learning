import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../../pages/LoginPage';

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

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Spies on console.log to hit the coverage for the log statement.
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    test('should render the email and password inputs', () => {
        // ARRANGE
        render(<MemoryRouter><LoginPage /></MemoryRouter>);

        // ASSERT
        expect(screen.getByPlaceholderText('email@address.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('**********')).toBeInTheDocument();
    });

    test('should update email and password state when user types', () => {
        // ARRANGE
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        const emailInput = screen.getByPlaceholderText('email@address.com');
        const passwordInput = screen.getByPlaceholderText('**********');

        // ACT
        fireEvent.change(emailInput, { target: { value: 'test@leer.nl' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // ASSERT
        expect(emailInput).toHaveValue('test@leer.nl');
        expect(passwordInput).toHaveValue('password123');
    });

    test('should navigate to /student and log data on successful login', () => {
        // ARRANGE
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        const submitBtn = screen.getByRole('button', { name: /Inloggen/i });

        // ACT
        fireEvent.click(submitBtn);

        // ASSERT
        expect(console.log).toHaveBeenCalledWith('Login attempt:', expect.any(Object));
        expect(mockNavigate).toHaveBeenCalledWith('/student');
    });

    test('should navigate to /register when the register toggle is clicked', () => {
        // ARRANGE
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        const registerTab = screen.getByRole('tab', { name: /Registreren/i });

        // ACT
        fireEvent.click(registerTab);

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    test('should stay on login tab when login toggle is clicked while active', () => {
        // ARRANGE
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        const loginTab = screen.getByRole('tab', { name: /Inloggen/i });

        // ACT
        // This triggers the 'else' branch of handleToggle where it just sets activeTab.
        fireEvent.click(loginTab);

        // ASSERT
        expect(loginTab).toHaveClass('active');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('should navigate to /resetpassword when forgot password is clicked', () => {
        // ARRANGE
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        const resetBtn = screen.getByText(/Wachtwoord vergeten\?/i);

        // ACT
        fireEvent.click(resetBtn);

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/resetpassword');
    });
});