import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import NotificationParent from '../../components/notifications/NotificationParent';

const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotificationParent', () => {
    test('renders notification button with badge', () => {
        renderWithRouter(<NotificationParent />);
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('opens dropdown on click', () => {
        renderWithRouter(<NotificationParent />);
        
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);

        expect(screen.getByText('2 nieuwe matchvoorstellen zijn gevonden')).toBeInTheDocument();
    });

    test('removes notification when close is clicked', () => {
        renderWithRouter(<NotificationParent />);
        
        // Open menu
        fireEvent.click(screen.getByLabelText(/Notifications/i));
        
        const closeButtons = screen.getAllByLabelText('Dismiss notification');
        const initialCount = closeButtons.length;
        
        // Click first close button
        fireEvent.click(closeButtons[0]);
        
        // Should have one less
        const newCloseButtons = screen.getAllByLabelText('Dismiss notification');
        expect(newCloseButtons.length).toBe(initialCount - 1);
    });
});