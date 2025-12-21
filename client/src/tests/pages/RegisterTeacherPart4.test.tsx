import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterTeacherPart4 from '../../pages/Registration/RegisterTeacherPart4';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterTeacherPart4', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should update bio value and handle file selection visibility', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart4 /></MemoryRouter>);
        const bioInput = screen.getByPlaceholderText(/I'm very motivated.../i);

        // ACT - Updates bio.
        fireEvent.change(bioInput, { target: { value: 'New Bio' } });
        // ACT - Enables CV upload.
        fireEvent.click(screen.getByLabelText(/Upload your CV\?/i));

        // ASSERT
        expect(bioInput).toHaveValue('New Bio');
        expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    test('should navigate to waiting screen', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart4 /></MemoryRouter>);

        // ACT
        fireEvent.click(screen.getByText(/Register/i));

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/register-teacher-waiting');
    });
});