import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterTeacherPart3 from '../../pages/Registration/RegisterTeacherPart3';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterTeacherPart3', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should correctly count rows when adding a new item', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart3 /></MemoryRouter>);
        const addButton = screen.getByLabelText(/Add new item/i);

        // ACT - Adds a new subject.
        fireEvent.click(addButton);

        // ASSERT - Finds selects via 'combobox' and inputs via 'textbox'.
        const selects = screen.getAllByRole('combobox');
        const textInputs = screen.getAllByRole('textbox');
        expect(selects.length + textInputs.length).toBe(3);
    });

    test('should toggle custom inputs via checkbox', () => {
        // ARRANGE
        render(<MemoryRouter><RegisterTeacherPart3 /></MemoryRouter>);
        const customCheckboxes = screen.getAllByRole('checkbox');

        // ACT - Turns off 'custom' for the second item.
        fireEvent.click(customCheckboxes[1]);

        // ASSERT - Both items should now be standard selects.
        const selects = screen.getAllByRole('combobox');
        expect(selects).toHaveLength(2);
    });
});