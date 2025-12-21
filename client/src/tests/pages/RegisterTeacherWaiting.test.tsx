import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterTeacherWaiting from '../../pages/Registration/RegisterTeacherWaiting';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterTeacherWaiting', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render success message and handle home redirect', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherWaiting /></MemoryRouter>);

        // ASSERT
        expect(screen.getByText(/Thank you for registering/i)).toBeInTheDocument();

        // ACT
        fireEvent.click(screen.getByRole('button'));

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});