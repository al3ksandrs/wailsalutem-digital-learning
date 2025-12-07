import React from 'react';
import '../css/expandable-list.css';

interface RemovableItemProps {
    children: React.ReactNode;
    onRemove: () => void;
}

export const RemovableItem: React.FC<RemovableItemProps> = ({ children, onRemove }) => {
    return (
        <div className="expandable-item-wrapper">
            <div className="expandable-item-content">
                {children}
            </div>
            <button 
                type="button" 
                className="expandable-item-delete"
                onClick={onRemove}
                aria-label="Remove item"
            >
                <span className="codicon codicon-trash"></span>
            </button>
        </div>
    );
};

interface ExpandableListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getItemKey: (item: T) => string | number;
    onAdd: () => void;
    onRemove: (index: number) => void;
    maxItems?: number;
}

const ExpandableList = <T,>({ 
    items, 
    renderItem, 
    getItemKey,
    onAdd, 
    onRemove, 
    maxItems = 4 
}: ExpandableListProps<T>) => {
    return (
        <div className="expandable-list-container">
            <div className="expandable-list-scroll-area">
                {items.length === 0 ? (
                    <div className="expandable-list-empty">
                        Lijst is leeg...
                    </div>
                ) : (
                    items.map((item, index) => (
                        <RemovableItem 
                            key={getItemKey(item)} 
                            onRemove={() => onRemove(index)}
                        >
                            {renderItem(item, index)}
                        </RemovableItem>
                    ))
                )}
            </div>

            {items.length < maxItems && (
                <div className="expandable-list-add">
                    <button 
                        type="button" 
                        className="expandable-list-add-btn"
                        onClick={onAdd}
                        aria-label="Add new item"
                    >
                        <span className="codicon codicon-add"></span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpandableList;