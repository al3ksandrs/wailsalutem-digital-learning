import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogoutButton from '../../components/LogoutButton';

describe('LogoutButton', () => {
    test('renders correctly', () => {
        render(<LogoutButton />);
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<LogoutButton onClick={handleClick} />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});