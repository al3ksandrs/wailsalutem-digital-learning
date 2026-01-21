import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LogoutButton from '../../components/LogoutButton';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

describe('LogoutButton', () => {
    test('renders correctly', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LogoutButton />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LogoutButton onClick={handleClick} performLogout={false} />
                </MemoryRouter>
            </QueryClientProvider>
        );
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});