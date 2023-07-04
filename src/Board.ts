/**
 * Symbol representing player id
 */
export enum Sym {
    Null=0,
    X,
    O,
}

/**
 * When checking who won, represents the result
 */
export enum BoardResult {
    // No one has won
    None=0,
    // Player 'X' won
    X,
    // Player 'O' won
    O,
    // Cats game, draw
    Cats,
}

export class Board {
    private rows: Sym[][];

    public constructor(rows?: Sym[][]) {
        if (rows) {
            this.rows = [];
            rows.forEach(row => this.rows.push([...row]));
        } else {
            this.reset();
        }
    }
    
    public copy(): Board {
        return new Board(this.rows);
    }

    public reset() {
        this.rows = [
            [Sym.Null, Sym.Null, Sym.Null],
            [Sym.Null, Sym.Null, Sym.Null],
            [Sym.Null, Sym.Null, Sym.Null]
        ];
    }

    public forEachRow(cb: (row: Sym[], i?: number) => any) {
        this.rows.forEach(cb);
    }

    public spaceEmpty(row: number, col: number) {
        return this.rows[row][col] === Sym.Null;
    }

    public set(row: number, col: number, sym: Sym): void {
        this.rows[row][col] = sym;
    }

    public get(row: number, col: number): Sym {
        return this.rows[row][col];
    }

    public nextOptimalMove(sym: Sym): {row: number, col: number, rating: number} {
        let bestRating = -Infinity;
        let bestCells: {row: number, col: number}[] = [];

        const rows = this.rows.length;
        const cols = this.rows[0].length;

        for (let row = 0; row < rows; ++row) {
            for (let col = 0; col < cols; ++col) {
                const rating = this.rateCell(row, col, sym);
                if (rating > bestRating) {
                    bestRating = rating;
                    bestCells = [{row, col}];
                } else if (rating === bestRating) {
                    bestCells.push({row, col});
                }
            }
        }
        const randIndex = Math.floor(Math.random() * bestCells.length);
        return {
            row: bestCells[randIndex].row,
            col: bestCells[randIndex].col,
            rating: bestRating,
        };
    }

    /**
     *  Gets the rating for a given cell position representing most optimal next play position
     *  for the given player symbol.
     *  Does not take into account blocking an opponent, make sure to check for this if programming
     *  the AI for a computer player or giving a player hint.
     *  Assumes a valid row and column was given.
     *  Safe to call if cell is occupied–it will efficiently return 0.
     *  @param row {number} integer, representing the target row to check
     *  @param col {number} integer, representing the target column to check
     *  @param sym {Sym} the player to check for
     *  @returns {number} the rating for the cell. Higher means greater optimization.
     *  Compare with the others cells for optimal next move.
     */
    public rateCell(row: number, col: number, sym: Sym): number {
        if (this.get(row, col) !== 0) // piece already here, non-viable position
            return 0;

        const cols = this.rows[0].length;
        const rows = this.rows.length;

        let rating = 0;

        // check row
        let temp = 0;
        for (let i = 0; i < cols; ++i) {
            const cur = i === col ? sym : this.get(row, i);

            if (cur === sym) {       // own piece, increase viability
                temp = (temp + 1) * cols;
            } else if (cur !== 0) {  // opposing piece, bad row
                temp = 0;
                break;
            }
        }

        rating += temp;

        // check column
        temp = 0;
        for (let i = 0; i < rows; ++i) {
            const cur = (i === row) ? sym : this.get(i, col);

            if (cur === sym)       // own piece, increase viability
                temp = (temp + 1) * rows;
            else if (cur !== 0) {  // opposing piece, bad row
                temp = 0;
                break;
            }
        }

        rating += temp;

        // check diags

        // currently do not support non-square grids
        if (rows != cols) return rating;

        // cell is in diag: top-left to bottom-right
        if (row == col) {
            temp = 0;
            for (let i = 0; i < rows; ++i) {
                const cur = i === row ? sym : this.get(i, i);

                if (cur === sym) {
                    temp = (temp + 1) * rows;
                } else if (cur !== 0) {
                    temp = 0;
                    break;
                }
            }

            rating += temp;
        }

        // cell is in diag: bottom-left to top-right
        if (rows-1-row === col) {
            temp = 0;
            for (let i = 0; i < rows; ++i) {
                const curRow = rows-1-i;
                const cur = curRow === row && i === col ? sym : this.get(curRow, i);

                if (cur === sym)
                    temp = (temp + 1) * rows;
                else if (cur !== 0) {
                    temp = 0;
                    break;
                }
            }

            rating += temp;
        }

        return rating;
    }

    /**
     * Check to see game win status.
     * @param sym {Sym?} optional: specific symbol to check for
     */
    public checkWin(sym?: Sym): {result: BoardResult, squares?: {row: number, col: number}[]} {

        if (sym) {
            const result = this.__checkWin(sym);
            if (result.didWin) {
                return {
                    result: sym === Sym.O ? BoardResult.O : BoardResult.X,
                    squares: result.squares
                };
            } else if (this.__boardFull()) {
                return {result: BoardResult.Cats};
            } else {
                return {result: BoardResult.None};
            }
        } else {
            let result;
            if ((result = this.__checkWin(Sym.X)))
                return {result: BoardResult.X, squares: result.squares};
            else if ((result = this.__checkWin(Sym.O)))
                return {result: BoardResult.O, squares: result.squares};
            else if (this.__boardFull())
                return {result: BoardResult.Cats};
            else
                return {result: BoardResult.None};
        }

    }

    private __checkWin(sym: Sym): {didWin: boolean, squares?: {row: number, col: number}[] } {
        // Check rows
        const squares = [{row: -1, col: -1}, {row: -1, col: -1}, {row: -1, col: -1}];
        for (let row = 0; row < this.rows.length; ++row) {

            let didWin = true;
            for (let col = 0; col < this.rows[0].length; ++col) {
                if (this.rows[row][col] !== sym) {
                    didWin = false;
                    break;
                }
                squares[col] = {row, col};
            }

            if (didWin) return {squares, didWin};
        }

        // Check cols
        for (let col = 0; col < this.rows[0].length; ++col) {

            let didWin = true;
            for (let row = 0; row < this.rows.length; ++row) {
                if (this.rows[row][col] !== sym) {
                    didWin = false;
                    break;
                }
                squares[row] = {row, col};
            }

            if (didWin) return {squares, didWin};
        }

        // Check diag 
        // Top-left to bottom-right
        let didWin = true;
        for (let i = 0; i < this.rows.length; ++i) {
            if (this.rows[i][i] !== sym) {
                didWin = false;
                break;
            }
            squares[i] = {row: i, col: i};
        }
        if (didWin) return {squares, didWin};

        // Bottom-left to top-right
        didWin = true;
        for (let i = 0; i < this.rows.length; ++i) {
            if (this.rows[this.rows.length-1-i][i] !== sym) {
                didWin = false;
                break;
            }
            squares[i] = {row: this.rows.length-1-i, col: i};
        }
        
        return {didWin, squares};
    }

    private __boardFull(): boolean {
        for (let row = 0; row < this.rows.length; ++row) {
            for (let col = 0; col < this.rows[row].length; ++col)
                if (this.rows[row][col] === Sym.Null)
                    return false;
        }

        return true;
    }
}
