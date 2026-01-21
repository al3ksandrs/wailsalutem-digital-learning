import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
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
  test('notification bell opens dropdown on click', () => {
    renderWithRouterAndQuery(<RoleProvider><Header /></RoleProvider>);

    const notificationButtons = screen.getAllByLabelText(/Notifications/i);
    fireEvent.click(notificationButtons[0]);

    expect(
      screen.getByText(/Je hebt een nieuwe connectie met/i)
    ).toBeInTheDocument();
  });
});
