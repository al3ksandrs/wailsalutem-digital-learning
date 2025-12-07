import React, { useState } from 'react';
import '../css/subject-tags.css';

interface SubjectTagsProps {
    items: string[];
    maxItems: number;
    direction: 'horizontal' | 'vertical';
    showDropdown: boolean;
}

const SubjectTags: React.FC<SubjectTagsProps> = ({
    items,
    maxItems,
    direction,
    showDropdown
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const needsDropdown = showDropdown && items.length > maxItems;

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    if (direction === 'vertical') {
        const visibleItems = (needsDropdown && !isExpanded) ? items.slice(0, maxItems) : items;
        return (
            <div className="subject-tags-container vertical">
                {visibleItems.map((tag, index) => (
                    <div key={`${tag}-${index}`} className="subject-tag-pill">
                        {tag}
                    </div>
                ))}
                {needsDropdown && (
                    <button
                        type="button"
                        className="subject-tags-toggle-btn"
                        onClick={handleToggle}
                        aria-label={isExpanded ? "Show fewer tags" : "Show more tags"}
                    >
                        <span className={`codicon codicon-chevron-down subject-tags-icon ${isExpanded ? 'is-expanded' : ''}`} />
                    </button>
                )}
            </div>
        );
    }

    const baseItems = items.slice(0, maxItems);
    const expandableItems = items.slice(maxItems);
    const canExpand = needsDropdown && expandableItems.length > 0;

    return (
        <div 
            className="subject-tags-container vertical" 
            style={{ alignItems: 'flex-start', gap: isExpanded && canExpand ? '0.5rem' : '0' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {baseItems.map((tag, index) => (
                    <div key={`${tag}-${index}`} className="subject-tag-pill">
                        {tag}
                    </div>
                ))}
                
                {canExpand && (
                    <button
                        type="button"
                        className="subject-tags-toggle-btn"
                        onClick={handleToggle}
                        aria-label={isExpanded ? "Show fewer tags" : "Show more tags"}
                    >
                        <span className={`codicon codicon-chevron-down subject-tags-icon ${isExpanded ? 'is-expanded' : ''}`} />
                    </button>
                )}
            </div>

            {isExpanded && canExpand && (
                Array.from({ length: Math.ceil(expandableItems.length / maxItems) }).map((_, rowIndex) => {
                    const rowItems = expandableItems.slice(rowIndex * maxItems, rowIndex * maxItems + maxItems);
                    const rowKey = rowItems.length > 0 ? `${rowItems[0]}-${rowIndex}` : `row-${rowIndex}`;

                    return (
                        <div key={rowKey} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {rowItems.map((tag, tagIndex) => {
                                const originalIndex = maxItems + (rowIndex * maxItems) + tagIndex;
                                return (
                                    <div key={`${tag}-${originalIndex}`} className="subject-tag-pill">
                                        {tag}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default SubjectTags;