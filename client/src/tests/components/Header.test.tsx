import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../../components/Header';
import { RoleProvider } from '../../navigation/role.config';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

const renderWithRouterAndQuery = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Header', () => {
  const mockLogout = vi.fn();

  test('renders logo, tabs, notifications, and logout button', () => {
    renderWithRouterAndQuery(<RoleProvider><Header onLogout={mockLogout} /></RoleProvider>);

    // Logo
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    // Tabs
    expect(screen.getByText('Mijn Matches')).toBeInTheDocument();
    expect(screen.getByText('Mijn Verzoeken')).toBeInTheDocument();
    expect(screen.getByText('Mijn Connecties')).toBeInTheDocument();

    // Notifications buttons (desktop + mobile)
    const notificationButtons = screen.getAllByLabelText(/Notifications/i);
    expect(notificationButtons.length).toBeGreaterThan(0);

    // Logout button
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', () => {
    renderWithRouterAndQuery(<RoleProvider><Header onLogout={mockLogout}/></RoleProvider>);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('notification bell opens dropdown on click', () => {
    renderWithRouterAndQuery(<RoleProvider><Header /></RoleProvider>);

    // Click the first bell (desktop or mobile)
    const notificationButtons = screen.getAllByLabelText(/Notifications/i);
    fireEvent.click(notificationButtons[0]);

    // Check for one of the notification texts
    expect(screen.getByText(/Je hebt een nieuwe connectie met/i)).toBeInTheDocument();
  });
});
