
// base class with sudoku utility methods
class Sudoku {

    constructor(board) {
        this.board = board;
    }

    // checks if a value is present in the given row
    inRow(row, value) {
        return this.board[row].includes(value);
    }

    // checks if a value is present in the given column
    inCol(col, value) {
        for (const row of this.board) {
            if (row[col] === value) {
                return true;
            }
        }
        return false;
    }

    // checks if a value is present in the 3x3 section that the given row and col
    // is located
    inSection(row, col, value) {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[startRow + i][startCol + j] === value) {
                    return true;
                }
            }
        }
        return false;
    }

    // checks a move in a row and column against the 3 sudoku constraints
    isValidMove(row, col, value) {
        return !(this.inRow(row, value) || this.inCol(col, value) || this.inSection(row, col, value));
    }

    // checks if the board is a valid Sudoku
    isValidBoard() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                const val = this.board[i][j];
                if (val !== 0) {
                    this.board[i][j] = 0;
                    if (this.isValidMove(i, j, val)) {
                        this.board[i][j] = val;
                    } else {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // returns a string representation of the board
    boardToString() {
        let str = "";
        for (const row of this.board) {
            for (const val of row) {
                str += val + " ";
            }
            str += "\n";
        }
        return str;
    }

}

// class that generates random sudoku boards
class SudokuGenerator extends Sudoku {

    constructor() {
        super(new Array(9).fill(null).map(r => r = new Array(9).fill(0)));  
    }

    generate() {
        let numFilledIn = Math.floor(Math.random() * 10) + 10;
        while (numFilledIn > 0) {
            let row, col;
            let coordsFound = false;
            while (!coordsFound) {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
                if (this.board[row][col] === 0) {
                    coordsFound = true;
                }
            }
            let value;
            let valueFound = false;
            while (!valueFound) {
                value = Math.floor(Math.random() * 9) + 1;
                if (this.isValidMove(row, col, value)) {
                    valueFound = true;
                }
            }
            this.board[row][col] = value;
            numFilledIn--;
        }
        return this.board;
    }

}

// class that solves sudoku boards using recursion and backtracking
class SudokuSolver extends Sudoku {

    constructor(board = null) {
        if (board === null) {
            this.board = new Array(9).fill(null).map(r => r = new Array(9).fill(0));
        } else {
            super(board);
        }
    }



    // searches the board for an empty (0) cell and returns the location in
    // an object, or null if none are found
    getNextEmpty() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    return {
                        row: i,
                        col: j
                    };
                }
            }
        }
        return null;
    }

    /*
     * This function will recursively place values into empty cells
     * until it cannot find a valid move for a cell. When this happens,
     * it will backtrack and try the next value in the previous cell.
     * When there are no remaining empty cells found, the puzzle is solved.
     */
    solve() {
        const nextMove = this.getNextEmpty();
        if (nextMove === null) { // if nextMove is null, the board is filled in
            return true;
        }
        for (let i = 1; i <= 9; i++) { // try each value 1-9
            if (this.isValidMove(nextMove.row, nextMove.col, i)) {
                this.board[nextMove.row][nextMove.col] = i;
                if (this.solve()) { // continue to the next empty 
                    return true;
                }
                // at this point we have backtracked, and will reset the value of the cell
                // and try the next one
                this.board[nextMove.row][nextMove.col] = 0;
            }
        }
        return false; // no value worked in this position, so return false to go back
    }
}
