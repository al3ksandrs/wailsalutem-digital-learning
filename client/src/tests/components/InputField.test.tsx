
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../../components/InputField';

describe('InputField', () => {
    test('renders text input correctly', () => {
        const handleChange = vi.fn();
        render(
            <InputField 
                label="Username" 
                value="" 
                onChange={handleChange} 
                placeholder="Enter name" 
            />
        );
        
        const input = screen.getByPlaceholderText('Enter name');
        fireEvent.change(input, { target: { value: 'John' } });
        
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(handleChange).toHaveBeenCalled();
    });

    test('renders checkbox correctly', () => {
        const handleChange = vi.fn();
        render(
            <InputField 
                type="checkbox" 
                label="Accept Terms" 
                checked={false} 
                onChange={handleChange} 
            />
        );

        const checkbox = screen.getByRole('checkbox');
        expect(screen.getByText('Accept Terms')).toBeInTheDocument();
        
        fireEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalled();
    });

    test('renders select dropdown correctly', () => {
        const options = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' }
        ];
        const handleChange = vi.fn();

        render(
            <InputField 
                type="select" 
                label="Choose" 
                options={options} 
                onChange={handleChange} 
                value=""
            />
        );

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '2' } });

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(handleChange).toHaveBeenCalled();
    });
});