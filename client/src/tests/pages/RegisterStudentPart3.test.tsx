import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterStudentPart3 from '../../pages/Registration/RegisterStudentPart3';
import { RoleProvider } from '../../navigation/role.config';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterStudentPart3', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should show initial selections and handle strict subject matching', () => {
        // ARRANGE
        render(<RoleProvider><MemoryRouter><RegisterStudentPart3 /></MemoryRouter></RoleProvider>);

        // ACT - Matches exact Economics button, ignoring Business Economics.
        const germanBtn = screen.getByRole('button', { name: /german/i });
        const economicsBtn = screen.getByRole('button', { name: /^economics$/i });

        // ASSERT - Verifies Bulma selection classes.
        expect(germanBtn).toHaveClass('is-link');
        expect(economicsBtn).toHaveClass('is-link');
    });

    test('should toggle selection when pill is clicked', () => {
        // ARRANGE
        render(<RoleProvider><MemoryRouter><RegisterStudentPart3 /></MemoryRouter></RoleProvider>);
        const mathBtn = screen.getByRole('button', { name: /math/i });

        // ACT - Selects Math.
        fireEvent.click(mathBtn);

        // ASSERT
        expect(mathBtn).toHaveClass('is-link');
    });
});