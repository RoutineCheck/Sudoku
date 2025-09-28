

import React from 'react';

const Cell = ({ value, isGiven, isSelected, isRelated, isHighlighted, onClick }) => {
    const isIncorrect = value < 0;
    const displayValue = Math.abs(value);

    const className = `cell 
        ${isGiven ? 'given' : 'user-filled'} 
        ${isSelected ? 'selected' : ''} 
        ${isRelated ? 'related' : ''} 
        ${isHighlighted ? 'highlighted' : ''}
        ${isIncorrect ? 'incorrect' : ''}
    `;

    return React.createElement('div', { className: className, onClick: onClick },
        displayValue !== 0 ? displayValue : ''
    );
};

export default Cell;

