import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationItem from '../../components/notifications/NotificationItem';

describe('NotificationItem', () => {
    const handleClose = vi.fn();
    const handleAction = vi.fn();

    const props = {
        id: 123,
        text: 'New Message',
        onClose: handleClose,
    };

    test('renders text', () => {
        render(<NotificationItem {...props} />);
        expect(screen.getByText('New Message')).toBeInTheDocument();
    });

    test('renders image when provided', () => {
        render(<NotificationItem {...props} image="avatar.png" />);
        const img = screen.getByAltText('Avatar');
        expect(img).toHaveAttribute('src', 'avatar.png');
    });

    test('renders action button and handles click', () => {
        render(
            <NotificationItem 
                {...props} 
                actionLabel="View" 
                onAction={handleAction} 
            />
        );
        
        const btn = screen.getByText('View');
        fireEvent.click(btn);
        expect(handleAction).toHaveBeenCalled();
    });

    test('handles close button click', () => {
        render(<NotificationItem {...props} />);
        
        const closeBtn = screen.getByLabelText('Dismiss notification');
        fireEvent.click(closeBtn);
        
        expect(handleClose).toHaveBeenCalledWith(123);
    });
});