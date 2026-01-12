import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterStudentPart2 from '../../pages/Registration/RegisterStudentPart2';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterStudentPart2', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should handle conditional profile visibility for year 4 students', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterStudentPart2 /></MemoryRouter>);
        
        // ACT - Change year to 4 (triggers profile select).
        fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '4' } });
        
        // ASSERT - Profile select uses a specific default option text.
        const profileSelect = screen.getByDisplayValue(/Select Profile.../i);
        expect(profileSelect).toBeInTheDocument();
        
        // ACT - Select a profile and proceed.
        fireEvent.change(profileSelect, { target: { value: 'N&T' } });
        fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/register-student-3', expect.any(Object));
    });

    test('should require parental consent for Basisschool level', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterStudentPart2 /></MemoryRouter>);

        // ACT - Change level to Basisschool.
        fireEvent.change(screen.getByDisplayValue('HAVO'), { target: { value: 'Basisschool' } });
        const nextBtn = screen.getByRole('button', { name: /Next/i });

        // ASSERT - Button is disabled until checkbox is clicked.
        expect(nextBtn).toBeDisabled();
        fireEvent.click(screen.getByRole('checkbox'));
        expect(nextBtn).not.toBeDisabled();
    });
});