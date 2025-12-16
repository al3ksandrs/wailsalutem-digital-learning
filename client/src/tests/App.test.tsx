import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Routing', () => {
    test('renders login page by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText('email@address.com')).toBeInTheDocument();
    });

    test('renders student page on /student route', () => {
        render(
            <MemoryRouter initialEntries={['/student']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Goedenavond, Hendrik')).toBeInTheDocument();
    });
});