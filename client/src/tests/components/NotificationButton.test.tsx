import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationButton from '../../components/notifications/NotificationButton';

describe('NotificationButton', () => {
    test('renders without badge when count is 0', () => {
        render(<NotificationButton count={0} />);
        const badge = document.querySelector('.notification-badge');
        expect(badge).not.toBeInTheDocument();
    });

    test('renders badge with count', () => {
        render(<NotificationButton count={5} />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders 99+ for high counts', () => {
        render(<NotificationButton count={150} />);
        expect(screen.getByText('99+')).toBeInTheDocument();
    });

    test('triggers onClick', () => {
        const handleClick = vi.fn();
        render(<NotificationButton count={1} onClick={handleClick} />);
        
        const btn = screen.getByRole('button');
        fireEvent.click(btn);
        
        expect(handleClick).toHaveBeenCalled();
    });

    test('applies dark mode class', () => {
        render(<NotificationButton darkMode={true} count={1} />);
        const btn = screen.getByRole('button');
        expect(btn).toHaveClass('mode-dark');
    });
});