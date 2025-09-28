

import React, { useState, useEffect, useCallback } from 'react';
import SudokuBoard from './components/SudokuBoard.js';
import NumberPalette from './components/NumberPalette.js';
import GameOverModal from './components/GameOverModal.js';
import { generateSudoku, solveSudoku, checkSolution, copyBoard } from './logic/sudoku.js';
import confetti from 'canvas-confetti';

const App = () => {
    const [difficulty, setDifficulty] = useState('medium');
    const [initialBoard, setInitialBoard] = useState(null);
    const [board, setBoard] = useState(null);
    const [solution, setSolution] = useState(null);
    const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1 });
    const [mistakes, setMistakes] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

    const startNewGame = useCallback(() => {
        const { puzzle, solvedPuzzle } = generateSudoku(difficulty);
        setInitialBoard(copyBoard(puzzle));
        setBoard(copyBoard(puzzle));
        setSolution(solvedPuzzle);
        setSelectedCell({ row: -1, col: -1 });
        setMistakes(0);
        setTimer(0);
        setIsPaused(false);
        setIsGameOver(false);
    }, [difficulty]);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        let interval;
        if (!isPaused && !isGameOver) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused, isGameOver]);

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
    };

    const handleKeyDown = useCallback((e) => {
        if (selectedCell.row === -1 || isGameOver) return;

        const { row, col } = selectedCell;
        
        if (initialBoard[row][col] !== 0) return;

        let newBoard = copyBoard(board);
        let value = 0;

        if (e.key >= '1' && e.key <= '9') {
            value = parseInt(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            value = 0;
        } else {
            return;
        }
        
        handleValueInput(value);

    }, [selectedCell, board, initialBoard, isGameOver]);
    
    const handleValueInput = (value) => {
        if (selectedCell.row === -1 || isGameOver) return;
        const { row, col } = selectedCell;

        if (initialBoard[row][col] !== 0) return;

        let newBoard = copyBoard(board);
        newBoard[row][col] = value;

        if (value !== 0 && newBoard[row][col] !== solution[row][col]) {
            setMistakes(m => m + 1);
        }
        
        setBoard(newBoard);

        const isComplete = newBoard.flat().every(cell => cell !== 0);
        if (isComplete && checkSolution(newBoard, solution)) {
            setIsGameOver(true);
            setIsPaused(true);
            confetti({ particleCount: 150, spread: 180 });
        }
    };


    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    
    const handleCheck = () => {
        const newBoardWithErrors = board.map((row, rIdx) => 
            row.map((cell, cIdx) => {
                if(initialBoard[rIdx][cIdx] === 0 && cell !== 0 && cell !== solution[rIdx][cIdx]) {
                    return -cell; // Mark as incorrect
                }
                return cell;
            })
        );
        setBoard(newBoardWithErrors);

        setTimeout(() => {
            const correctedBoard = newBoardWithErrors.map(row => row.map(cell => Math.abs(cell)));
            setBoard(correctedBoard);
        }, 1000);
    };
    
    const handleSolve = () => {
        setBoard(solution);
        setIsGameOver(true);
        setIsPaused(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    if (!board) {
        return React.createElement('div', null, 'Loading...');
    }

    return (
        React.createElement(React.Fragment, null,
            React.createElement('h1', { className: 'title' }, 'Sudoku'),
            React.createElement('div', { className: 'game-container' },
                React.createElement('div', { className: 'game-info' },
                    React.createElement('span', null, `Mistakes: ${mistakes}`),
                    React.createElement('span', null, ' | '),
                    React.createElement('span', null, `Time: ${formatTime(timer)}`)
                ),
                React.createElement(SudokuBoard, {
                    board: board,
                    initialBoard: initialBoard,
                    onCellClick: handleCellClick,
                    selectedCell: selectedCell,
                }),
                React.createElement(NumberPalette, { onNumberClick: handleValueInput }),
                React.createElement('div', { className: 'controls' },
                    React.createElement('button', { className: 'btn', onClick: handleCheck, disabled: isGameOver }, 'Check'),
                    React.createElement('button', { className: 'btn', onClick: handleSolve, disabled: isGameOver }, 'Solve')
                ),
                React.createElement('div', { className: 'difficulty-controls' },
                    React.createElement('select', { className: 'difficulty-select', value: difficulty, onChange: (e) => setDifficulty(e.target.value) },
                        React.createElement('option', { value: 'easy' }, 'Easy'),
                        React.createElement('option', { value: 'medium' }, 'Medium'),
                        React.createElement('option', { value: 'hard' }, 'Hard'),
                        React.createElement('option', { value: 'expert' }, 'Expert')
                    ),
                    React.createElement('button', { className: 'btn', onClick: startNewGame }, 'New Game')
                )
            ),
            isGameOver && React.createElement(GameOverModal, { time: formatTime(timer), mistakes: mistakes, onPlayAgain: startNewGame })
        )
    );
};

export default App;

