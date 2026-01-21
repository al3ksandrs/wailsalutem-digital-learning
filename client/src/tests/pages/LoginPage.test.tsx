import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '../../pages/LoginPage';

// Mock navigation
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

// Mock authService
const mockMutate = vi.fn();
vi.mock('../../services/authService', () => ({
    useLogin: () => ({
        mutate: mockMutate,
        isPending: false,
        error: null,
        isError: false
    }),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
        
        // Default implementation for mutate: calls onSuccess immediately
        mockMutate.mockImplementation((_variables, options) => {
             // Simulate successful login returning a student user
             if (options && options.onSuccess) {
                 options.onSuccess({ role: 'Student', name: 'Test User' });
             }
        });
    });

    const renderWithProviders = (ui: React.ReactNode) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>{ui}</MemoryRouter>
            </QueryClientProvider>
        );
    };

    test('should render the email and password inputs', () => {
        renderWithProviders(<LoginPage />);
        expect(screen.getByPlaceholderText('email@address.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('**********')).toBeInTheDocument();
    });

    test('should update email and password state when user types', () => {
        renderWithProviders(<LoginPage />);
        const emailInput = screen.getByPlaceholderText('email@address.com');
        const passwordInput = screen.getByPlaceholderText('**********');

        fireEvent.change(emailInput, { target: { value: 'test@leer.nl' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@leer.nl');
        expect(passwordInput).toHaveValue('password123');
    });

    test('should navigate to /student and log data on successful login', () => {
        renderWithProviders(<LoginPage />);
        const submitBtn = screen.getByRole('button', { name: /Inloggen/i });
        const emailInput = screen.getByPlaceholderText('email@address.com');
        const passwordInput = screen.getByPlaceholderText('**********');

        // Fill form to pass validation
        fireEvent.change(emailInput, { target: { value: 'test@leer.nl' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        
        fireEvent.click(submitBtn);

        // Updated expectation to match component code: 'Login successful:'
        expect(console.log).toHaveBeenCalledWith('Login successful:', expect.any(Object));
        expect(mockNavigate).toHaveBeenCalledWith('/student');
    });

    test('should navigate to /register when the register toggle is clicked', () => {
        renderWithProviders(<LoginPage />);
        const registerTab = screen.getByRole('tab', { name: /Registreren/i });
        fireEvent.click(registerTab);
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    test('should stay on login tab when login toggle is clicked while active', () => {
        renderWithProviders(<LoginPage />);
        const loginTab = screen.getByRole('tab', { name: /Inloggen/i });
        fireEvent.click(loginTab);
        expect(loginTab).toHaveClass('active');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('should navigate to /resetpassword when forgot password is clicked', () => {
        renderWithProviders(<LoginPage />);
        const resetBtn = screen.getByText(/Wachtwoord vergeten\?/i);
        fireEvent.click(resetBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/resetpassword');
    });
});