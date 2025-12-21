import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../../pages/LoginPage';

const { mockNavigate } = vi.hoisted(() => {
    return { mockNavigate: vi.fn() };
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders login form', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('email@address.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('**********')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Inloggen' })).toBeInTheDocument();
    });

    test('updates input fields', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('email@address.com');
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        expect(emailInput).toHaveValue('test@test.com');
    });

    test('navigates to register page when toggle is clicked', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const registerTab = screen.getByRole('tab', { name: 'Registreren' });
        fireEvent.click(registerTab);

        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    test('navigates to student page on form submit', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const submitBtn = screen.getByRole('button', { name: 'Inloggen' });
        fireEvent.click(submitBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/student');
    });
});