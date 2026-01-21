// RegisterPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from 'client/src/pages/Registration/RegisterPage.tsx';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// MOCKS
// =============================================================================

// Mock react-router-dom to spy on navigation
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

// Mock child components to isolate RegisterPage logic.
// We make them simple HTML elements to easily interact with them in tests.
vi.mock('../../components/Logo', () => ({
    default: () => <div data-testid="logo">Logo</div>
}));

vi.mock('../../components/LoginRegisterToggle', () => ({
    default: ({ onToggle }: { onToggle: (tab: string) => void }) => (
        <button onClick={() => onToggle('login')} data-testid="toggle-login">
            Switch to Login
        </button>
    )
}));

vi.mock('../../components/WSButton', () => ({
    default: ({ label, onClick, type }: any) => (
        <button onClick={onClick} type={type}>
            {label}
        </button>
    )
}));

// We mock InputField to ensure we can easily select inputs by their label
// and trigger onChange events that bubble up to the parent.
vi.mock('../../components/InputField', () => ({
    default: ({ label, onChange, value, options }: any) => {
        if (options) {
            return (
                <label>
                    {label}
                    <select data-testid={`select-${label}`} onChange={onChange} value={value}>
                        {options.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </label>
            );
        }
        return (
            <label>
                {label}
                <input 
                    data-testid={`input-${label}`} 
                    onChange={onChange} 
                    value={value} 
                />
            </label>
        );
    }
}));

// =============================================================================
// TESTS
// =============================================================================

describe('RegisterPage Component', () => {
    const navigateMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(navigateMock);
    });

    it('should render all form fields correctly', () => {
        // ARRANGE
        render(<RegisterPage />);

        // ASSERT
        expect(screen.getByTestId('logo')).toBeInTheDocument();
        expect(screen.getByTestId('select-I am a')).toBeInTheDocument();
        expect(screen.getByTestId('input-Full Name')).toBeInTheDocument();
        expect(screen.getByTestId('input-Email')).toBeInTheDocument();
        expect(screen.getByTestId('input-Password')).toBeInTheDocument();
        expect(screen.getByTestId('input-Confirm Password')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('should show validation errors when submitting empty form', () => {
        // ARRANGE
        render(<RegisterPage />);
        const registerButton = screen.getByText('Register');

        // ACT
        fireEvent.click(registerButton);

        // ASSERT
        expect(screen.getByText('Full Name is required.')).toBeInTheDocument();
        expect(screen.getByText('Email address is required.')).toBeInTheDocument();
        expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });

    it('should show validation error for invalid email and password complexity', () => {
        // ARRANGE
        render(<RegisterPage />);
        const nameInput = screen.getByTestId('input-Full Name');
        const emailInput = screen.getByTestId('input-Email');
        const passwordInput = screen.getByTestId('input-Password');
        const registerButton = screen.getByText('Register');

        // ACT
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } }); // Invalid email
        fireEvent.change(passwordInput, { target: { value: 'weak' } }); // Weak password
        fireEvent.click(registerButton);

        // ASSERT
        expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
        // The validator returns a specific error for length or complexity
        expect(screen.getByText(/Password must be at least 8 characters long/)).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('should show validation error when passwords do not match', () => {
        // ARRANGE
        render(<RegisterPage />);
        const nameInput = screen.getByTestId('input-Full Name');
        const emailInput = screen.getByTestId('input-Email');
        const passwordInput = screen.getByTestId('input-Password');
        const confirmInput = screen.getByTestId('input-Confirm Password');
        const registerButton = screen.getByText('Register');

        // ACT
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
        fireEvent.change(confirmInput, { target: { value: 'Mismatch123' } });
        fireEvent.click(registerButton);

        // ASSERT
        expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('should navigate to student registration page on successful student input', () => {
        // ARRANGE
        render(<RegisterPage />);
        const nameInput = screen.getByTestId('input-Full Name');
        const emailInput = screen.getByTestId('input-Email');
        const passwordInput = screen.getByTestId('input-Password');
        const confirmInput = screen.getByTestId('input-Confirm Password');
        const roleSelect = screen.getByTestId('select-I am a');
        const registerButton = screen.getByText('Register');

        // ACT
        // Ensure Role is Student
        fireEvent.change(roleSelect, { target: { value: 'Student / Parent' } });
        fireEvent.change(nameInput, { target: { value: 'Student Name' } });
        fireEvent.change(emailInput, { target: { value: 'student@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
        fireEvent.change(confirmInput, { target: { value: 'StrongPass123' } });
        
        fireEvent.click(registerButton);

        // ASSERT
        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith('/register-student-2');
    });

    it('should navigate to teacher registration page on successful teacher input', () => {
        // ARRANGE
        render(<RegisterPage />);
        const nameInput = screen.getByTestId('input-Full Name');
        const emailInput = screen.getByTestId('input-Email');
        const passwordInput = screen.getByTestId('input-Password');
        const confirmInput = screen.getByTestId('input-Confirm Password');
        const roleSelect = screen.getByTestId('select-I am a');
        const registerButton = screen.getByText('Register');

        // ACT
        // Change Role to Teacher
        fireEvent.change(roleSelect, { target: { value: 'Teacher' } });
        
        fireEvent.change(nameInput, { target: { value: 'Teacher Name' } });
        fireEvent.change(emailInput, { target: { value: 'teacher@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
        fireEvent.change(confirmInput, { target: { value: 'StrongPass123' } });
        
        fireEvent.click(registerButton);

        // ASSERT
        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith('/register-teacher-2');
    });

    it('should redirect to login page when toggle is clicked', () => {
        // ARRANGE
        render(<RegisterPage />);
        const toggleButton = screen.getByTestId('toggle-login');

        // ACT
        fireEvent.click(toggleButton);

        // ASSERT
        expect(navigateMock).toHaveBeenCalledWith('/');
    });
});