import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterTeacherPart2 from '../../pages/Registration/RegisterTeacherPart2';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterTeacherPart2', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render expertise list and navigate to part 3', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart2 /></MemoryRouter>);

        // ASSERT - Checks initial list items.
        expect(screen.getByDisplayValue('HBO')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Universiteit')).toBeInTheDocument();

        // ACT - Proceed to next step.
        const nextBtn = screen.getByText(/Volgende stap/i);
        fireEvent.click(nextBtn);

        // ASSERT
        expect(mockNavigate).toHaveBeenCalledWith('/register-teacher-3');
    });
});