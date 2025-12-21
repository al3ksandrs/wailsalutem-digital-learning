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
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    test('updates bio and navigates on register (Submit Branch)', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart4 /></MemoryRouter>);
        const bioInput = screen.getByPlaceholderText(/I'm very motivated.../i);

        // ACT
        fireEvent.change(bioInput, { target: { value: 'My bio text' } });
        fireEvent.click(screen.getByText('Register'));

        // ASSERT
        expect(console.log).toHaveBeenCalledWith('Bio:', 'My bio text');
        expect(mockNavigate).toHaveBeenCalledWith('/register-teacher-waiting');
    });

    test('handles file upload and removal (File Logic Branches)', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart4 /></MemoryRouter>);
        const checkbox = screen.getByLabelText(/Upload your CV\?/i);

        // ACT - Enable upload
        fireEvent.click(checkbox);
        const file = new File(['test'], 'cv.pdf', { type: 'application/pdf' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });
        
        // ASSERT
        expect(screen.getByText(/cv.pdf/i)).toBeInTheDocument();

        // ACT - Remove file
        fireEvent.click(screen.getByLabelText('remove file'));
        expect(screen.queryByText(/cv.pdf/i)).not.toBeInTheDocument();
    });

    test('clears file when upload is disabled (Toggle Cleanup Branch)', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart4 /></MemoryRouter>);
        const checkbox = screen.getByLabelText(/Upload your CV\?/i);

        // ACT - Upload then uncheck
        fireEvent.click(checkbox);
        const file = new File(['test'], 'cv.pdf', { type: 'application/pdf' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });
        
        fireEvent.click(checkbox); // Uncheck triggers cleanup logic

        // ASSERT
        expect(screen.queryByText(/cv.pdf/i)).not.toBeInTheDocument();
    });
});