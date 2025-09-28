

import React from 'react';

const NumberPalette = ({ onNumberClick }) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return React.createElement('div', { className: 'number-palette' },
        numbers.map(num =>
            React.createElement('button', {
                key: num,
                className: 'palette-btn',
                onClick: () => onNumberClick(num)
            }, num)
        ),
        React.createElement('button', {
            className: 'palette-btn',
            onClick: () => onNumberClick(0),
            'aria-label': 'Erase'
        },
            React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement('path', { d: "M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" }),
                React.createElement('line', { x1: "18", y1: "9", x2: "12", y2: "15" }),
                React.createElement('line', { x1: "12", y1: "9", x2: "18", y2: "15" })
            )
        )
    );
};

export default NumberPalette;

