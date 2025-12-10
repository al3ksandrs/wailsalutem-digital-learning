import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubjectTags from '../../components/SubjectTags';

describe('SubjectTags', () => {
    const items = ['Math', 'Science', 'English', 'History', 'Art'];

    test('renders only maxItems initially', () => {
        render(
            <SubjectTags 
                items={items} 
                maxItems={2} 
                direction="vertical" 
                showDropdown={true} 
            />
        );

        expect(screen.getByText('Math')).toBeInTheDocument();
        expect(screen.getByText('Science')).toBeInTheDocument();
        expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    test('toggles expansion when dropdown button is clicked', () => {
        render(
            <SubjectTags 
                items={items} 
                maxItems={2} 
                direction="vertical" 
                showDropdown={true} 
            />
        );

        const button = screen.getByLabelText('Show more tags');
        fireEvent.click(button);

        expect(screen.getByText('English')).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label', 'Show fewer tags');
    });
});