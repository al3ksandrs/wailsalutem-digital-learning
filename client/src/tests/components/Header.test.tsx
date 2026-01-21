import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { RoleProvider } from '../../navigation/role.config';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {

  test('notification bell opens dropdown on click', () => {
    renderWithRouter(
      <RoleProvider>
        <Header />
      </RoleProvider>
    );

    const notificationButtons = screen.getAllByLabelText(/Notifications/i);
    fireEvent.click(notificationButtons[0]);

    expect(
      screen.getByText(/Je hebt een nieuwe connectie met/i)
    ).toBeInTheDocument();
  });
});
