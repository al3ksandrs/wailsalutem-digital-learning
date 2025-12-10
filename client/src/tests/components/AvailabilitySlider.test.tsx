import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvailabilitySlider from '../../components/AvailabilitySlider';

describe('AvailabilitySlider', () => {
    test('renders day label and time range', () => {
        render(
            <AvailabilitySlider 
                day="Maandag" 
                value={[9, 17]} 
            />
        );

        expect(screen.getByText('Maandag')).toBeInTheDocument();
        // 9 -> 9:00, 17 -> 17:00. component formats numbers to time strings
        expect(screen.getByText('9:00 - 17:00')).toBeInTheDocument();
    });

    test('formats fractional times correctly', () => {
        // 9.5 -> 9:30
        render(
            <AvailabilitySlider 
                day="Dinsdag" 
                value={[9.5, 17.25]} 
            />
        );
        // 17.25 * 60 = 15 mins
        expect(screen.getByText('9:30 - 17:15')).toBeInTheDocument();
    });

    test('renders the slider element', () => {
        // we look for the slider role or class provided by MUI
        render(<AvailabilitySlider day="Woensdag" />);
        const sliders = screen.getAllByRole('slider');
        expect(sliders.length).toBeGreaterThan(0);
    });
});