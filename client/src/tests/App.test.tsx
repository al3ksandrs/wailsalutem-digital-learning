import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';
import { RoleProvider } from '../navigation/role.config';

describe('App Routing', () => {
    test('renders login page by default', () => {
        render(
            <RoleProvider>
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            </RoleProvider>
        );
        expect(screen.getByPlaceholderText('email@address.com')).toBeInTheDocument();
    });

    test('renders student page on /student route', () => {
        render(
            <RoleProvider>
                <MemoryRouter initialEntries={['/student']}>
                    <App />
                </MemoryRouter>
            </RoleProvider>
        );
        expect(screen.getByText('Goedenavond, Hendrik')).toBeInTheDocument();
    });
});