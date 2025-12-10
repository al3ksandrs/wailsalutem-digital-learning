import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScreenLayout from '../../components/ScreenLayout';

describe('ScreenLayout', () => {
    test('renders greeting and titles', () => {
        render(
            <ScreenLayout 
                greeting="Hello" 
                rightTitle="Section"
                leftContent={<div>Left</div>}
                rightContent={<div>Right</div>}
            />
        );

        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Section')).toBeInTheDocument();
    });

    test('renders content slots correctly', () => {
        render(
            <ScreenLayout 
                leftContent={<div data-testid="left-slot">Left Content</div>}
                rightContent={<div data-testid="right-slot">Right Content</div>}
            />
        );

        expect(screen.getByTestId('left-slot')).toBeInTheDocument();
        expect(screen.getByTestId('right-slot')).toBeInTheDocument();
    });
});