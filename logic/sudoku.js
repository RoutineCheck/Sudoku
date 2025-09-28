

// Sudoku Generator and Solver

// Helper to create a 9x9 grid
const createGrid = () => Array(9).fill(null).map(() => Array(9).fill(0));

// Helper to shuffle an array
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Check if a number is valid in a given position
const isValid = (grid, row, col, num) => {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
};

// Fill the grid with a valid Sudoku solution
const fillGrid = (grid) => {
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                for (const num of numbers) {
                    if (isValid(grid, i, j, num)) {
                        grid[i][j] = num;
                        if (fillGrid(grid)) {
                            return true;
                        }
                        grid[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

// Solve a Sudoku puzzle (backtracking)
export const solveSudoku = (grid) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, i, j, num)) {
                        grid[i][j] = num;
                        if (solveSudoku(grid)) {
                            return true;
                        }
                        grid[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

// Count solutions for a puzzle to ensure uniqueness
const countSolutions = (grid) => {
    let count = 0;
    const solveAndCount = (board) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    for (let num = 1; num <= 9 && count < 2; num++) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            solveAndCount(board);
                            board[i][j] = 0; // Backtrack
                        }
                    }
                    return;
                }
            }
        }
        count++;
    };
    solveAndCount(grid);
    return count;
};

export const copyBoard = (board) => board.map(row => [...row]);

// Generate a Sudoku puzzle
export const generateSudoku = (difficulty) => {
    const solvedPuzzle = createGrid();
    fillGrid(solvedPuzzle);

    const puzzle = copyBoard(solvedPuzzle);
    
    let attempts = 5;
    const difficultyMap = {
        easy: 40,
        medium: 50,
        hard: 55,
        expert: 60,
    };
    let cellsToRemove = difficultyMap[difficulty] || 50;

    while (cellsToRemove > 0 && attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] === 0) {
            continue;
        }

        const backup = puzzle[row][col];
        puzzle[row][col] = 0;
        
        const puzzleCopy = copyBoard(puzzle);
        
        if (countSolutions(puzzleCopy) !== 1) {
            puzzle[row][col] = backup;
            attempts--;
        } else {
            cellsToRemove--;
        }
    }
    
    return { puzzle, solvedPuzzle };
};

// Check if the user's solution is correct
export const checkSolution = (userBoard, solution) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (userBoard[i][j] !== solution[i][j]) {
                return false;
            }
        }
    }
    return true;
};

