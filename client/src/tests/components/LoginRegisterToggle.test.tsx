import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginRegisterToggle from '../../components/LoginRegisterToggle';

describe('LoginRegisterToggle', () => {
    const handleToggle = vi.fn();

    test('renders both options', () => {
        render(<LoginRegisterToggle activeTab="login" onToggle={handleToggle} />);
        expect(screen.getByText('Inloggen')).toBeInTheDocument();
        expect(screen.getByText('Registreren')).toBeInTheDocument();
    });

    test('applies active class to current tab', () => {
        render(<LoginRegisterToggle activeTab="register" onToggle={handleToggle} />);
        
        const registerBtn = screen.getByRole('tab', { name: 'Registreren' });
        const loginBtn = screen.getByRole('tab', { name: 'Inloggen' });

        expect(registerBtn).toHaveClass('active');
        expect(loginBtn).not.toHaveClass('active');
    });

    test('calls onToggle with correct value when clicked', () => {
        render(<LoginRegisterToggle activeTab="login" onToggle={handleToggle} />);
        
        fireEvent.click(screen.getByText('Registreren'));
        expect(handleToggle).toHaveBeenCalledWith('register');

        fireEvent.click(screen.getByText('Inloggen'));
        expect(handleToggle).toHaveBeenCalledWith('login');
    });
});