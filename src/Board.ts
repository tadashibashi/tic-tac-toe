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

