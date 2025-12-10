import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WSButton from '../../components/WSButton';

describe('WSButton', () => {
    test('renders with label', () => {
        render(<WSButton label="Click Me" />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('handles onClick event', () => {
        const handleClick = vi.fn();
        render(<WSButton label="Click Me" onClick={handleClick} />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('applies fullWidth class when prop is true', () => {
        render(<WSButton label="Full" fullWidth={true} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('is-fullwidth');
    });

    test('is disabled when disabled prop is set', () => {
        render(<WSButton label="Disabled" disabled={true} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});