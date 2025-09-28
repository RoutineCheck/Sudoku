

import React from 'react';
import Cell from './Cell.js';

const SudokuBoard = ({ board, initialBoard, onCellClick, selectedCell }) => {
    return (
        React.createElement('div', { className: 'sudoku-board' },
            board.map((row, rowIndex) =>
                row.map((value, colIndex) => {
                    const isGiven = initialBoard[rowIndex][colIndex] !== 0;
                    const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
                    const isRelated = !isSelected && (selectedCell.row === rowIndex || selectedCell.col === colIndex ||
                        (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) && Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));
                    const selectedValue = board[selectedCell.row]?.[selectedCell.col];
                    const isHighlighted = selectedValue !== 0 && selectedValue !== undefined && Math.abs(value) === Math.abs(selectedValue);
                    return React.createElement(Cell, {
                        key: `${rowIndex}-${colIndex}`,
                        value: value,
                        isGiven: isGiven,
                        isSelected: isSelected,
                        isRelated: isRelated,
                        isHighlighted: isHighlighted,
                        onClick: () => onCellClick(rowIndex, colIndex)
                    });
                })
            )
        )
    );
};

export default SudokuBoard;

