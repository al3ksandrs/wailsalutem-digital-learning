import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import Logo from '../../components/Logo';

describe('Logo', () => {

    test('renders logo text and slogan', () => {
        render(<Logo />);
        expect(screen.getByText('LeerMatch')).toBeInTheDocument();
        expect(screen.getByText('Leerlingen verbinden met de juiste docenten')).toBeInTheDocument();
    });

    test('renders logo image', () => {
        render(<Logo />);
        const img = screen.getByAltText('Graduation Cap');
        expect(img).toBeInTheDocument();
        expect(img.getAttribute('src')).toContain('graduation-cap-white.png');
    });
    
});