import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Header from '../../components/Header';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
  const mockLogout = vi.fn();

  test('renders logo, tabs, notifications, and logout button', () => {
    renderWithRouter(<Header onLogout={mockLogout} />);

    // Logo
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    // Tabs
    expect(screen.getByText('Voorgestelde matches')).toBeInTheDocument();
    expect(screen.getByText('Mijn verzoeken')).toBeInTheDocument();
    expect(screen.getByText('Connecties')).toBeInTheDocument();

    // Notifications buttons (desktop + mobile)
    const notificationButtons = screen.getAllByLabelText(/Notifications/i);
    expect(notificationButtons.length).toBeGreaterThan(0);

    // Logout button
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', () => {
    renderWithRouter(<Header onLogout={mockLogout} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('notification bell opens dropdown on click', () => {
    renderWithRouter(<Header />);

    // Click the first bell (desktop or mobile)
    const notificationButtons = screen.getAllByLabelText(/Notifications/i);
    fireEvent.click(notificationButtons[0]);

    // Check for one of the notification texts
    expect(screen.getByText(/Je hebt een nieuwe connectie met/i)).toBeInTheDocument();
  });
});
