import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpandableList from '../../components/ExpandableList';

describe('ExpandableList', () => {
    const mockItems = ['Item A', 'Item B'];
    const handleAdd = vi.fn();
    const handleRemove = vi.fn();

    const renderItem = (item: string) => <span>{item}</span>;
    const getItemKey = (item: string) => item;

    test('renders list items', () => {
        render(
            <ExpandableList 
                items={mockItems}
                renderItem={renderItem}
                getItemKey={getItemKey}
                onAdd={handleAdd}
                onRemove={handleRemove}
            />
        );

        expect(screen.getByText('Item A')).toBeInTheDocument();
        expect(screen.getByText('Item B')).toBeInTheDocument();
    });

    test('calls onRemove when delete button is clicked', () => {
        render(
            <ExpandableList 
                items={mockItems}
                renderItem={renderItem}
                getItemKey={getItemKey}
                onAdd={handleAdd}
                onRemove={handleRemove}
            />
        );

        const removeButtons = screen.getAllByLabelText('Remove item');
        fireEvent.click(removeButtons[0]);

        expect(handleRemove).toHaveBeenCalledWith(0);
    });

    test('calls onAdd when add button is clicked', () => {
        render(
            <ExpandableList 
                items={mockItems}
                renderItem={renderItem}
                getItemKey={getItemKey}
                onAdd={handleAdd}
                onRemove={handleRemove}
                maxItems={5}
            />
        );

        const addButton = screen.getByLabelText('Add new item');
        fireEvent.click(addButton);

        expect(handleAdd).toHaveBeenCalled();
    });

    test('hides add button when maxItems is reached', () => {
        render(
            <ExpandableList 
                items={['A', 'B']}
                renderItem={renderItem}
                getItemKey={getItemKey}
                onAdd={handleAdd}
                onRemove={handleRemove}
                maxItems={2}
            />
        );

        const addButton = screen.queryByLabelText('Add new item');
        expect(addButton).not.toBeInTheDocument();
    });
});