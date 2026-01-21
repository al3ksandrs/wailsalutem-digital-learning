import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';
import { RoleProvider } from '../navigation/role.config';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

describe('App Routing', () => {
    test('renders login page by default', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <RoleProvider>
                    <MemoryRouter initialEntries={['/']}>
                        <App />
                    </MemoryRouter>
                </RoleProvider>
            </QueryClientProvider>
        );
        expect(screen.getByPlaceholderText('email@address.com')).toBeInTheDocument();
    });

    test('renders student page on /student route', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <RoleProvider>
                    <MemoryRouter initialEntries={['/student']}>
                        <App />
                    </MemoryRouter>
                </RoleProvider>
            </QueryClientProvider>
        );
        expect(screen.getByText('Goedenavond, Hendrik')).toBeInTheDocument();
    });
});