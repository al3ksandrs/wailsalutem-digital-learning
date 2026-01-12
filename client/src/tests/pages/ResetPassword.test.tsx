import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ResetPassword from '../../pages/ResetPassword';

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

describe('ResetPassword', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders reset password form', () => {
        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('email@address.com')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Verstuur' })).toBeInTheDocument();
    });

    test('updates input fields', () => {
        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('email@address.com');
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        expect(emailInput).toHaveValue('test@test.com');
    });
});