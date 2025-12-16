import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import RegisterTeacherPart2 from '../../pages/RegisterTeacherPart2';

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

describe('RegisterTeacherPart2', () => {
    test('renders initial expertise items', () => {
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );
        expect(screen.getAllByDisplayValue('HBO')).toHaveLength(1);
        expect(screen.getAllByDisplayValue('Universiteit')).toHaveLength(1);
    });

    test('adds a new expertise line', () => {
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );

        const addButton = screen.getByLabelText('Add new item');
        fireEvent.click(addButton);

        const selects = screen.getAllByRole('combobox');
        expect(selects.length).toBe(3); 
    });

    test('removes an expertise line', () => {
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );

        const removeButtons = screen.getAllByLabelText('Remove item');
        fireEvent.click(removeButtons[0]);

        expect(screen.queryByDisplayValue('HBO')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Universiteit')).toBeInTheDocument();
    });

    test('navigates on next', () => {
        render(
            <MemoryRouter>
                <RegisterTeacherPart2 />
            </MemoryRouter>
        );

        const nextBtn = screen.getByText('Volgende stap');
        fireEvent.click(nextBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/student');
    });
});