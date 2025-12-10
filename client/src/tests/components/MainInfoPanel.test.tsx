import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainInfoPanel from '../../components/MainInfoPanel';

describe('MainInfoPanel', () => {
    test('renders with provided values', () => {
        render(<MainInfoPanel pending={5} matches={10} connections={2} />);
        
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Openstaande verzoeken')).toBeInTheDocument();
        
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('Matches')).toBeInTheDocument();

        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Connecties')).toBeInTheDocument();
    });

    test('renders default values (0) if no props provided', () => {
        render(<MainInfoPanel />);
        
        const zeros = screen.getAllByText('0');
        expect(zeros).toHaveLength(3);
    });
});