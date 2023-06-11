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
    public checkWin(sym?: Sym): BoardResult {
        if (sym) {
            if (this.__checkWin(sym)) {
                return sym === Sym.O ? BoardResult.O : BoardResult.X;
            } else if (this.__boardFull()) {
                return BoardResult.Cats;
            } else {
                return BoardResult.None;
            }
        } else {
            if (this.__checkWin(Sym.X))
                return BoardResult.X;
            else if (this.__checkWin(Sym.O))
                return BoardResult.O;
            else if (this.__boardFull())
                return BoardResult.Cats;
            else
                return BoardResult.None;
        }

    }

    private __checkWin(sym: Sym) {
        // Check rows
        for (let row = 0; row < this.rows.length; ++row) {

            let didWin = true;
            for (let col = 0; col < this.rows[0].length; ++col) {
                if (this.rows[row][col] !== sym) {
                    didWin = false;
                    break;
                }
            }

            if (didWin) return true;
        }

        // Check cols
        for (let col = 0; col < this.rows[0].length; ++col) {

            let didWin = true;
            for (let row = 0; row < this.rows.length; ++row) {
                if (this.rows[row][col] !== sym) {
                    didWin = false;
                    break;
                }
            }

            if (didWin) return true;
        }

        // Check diag 
        // Top-left to bottom-right
        let didWin = true;
        for (let i = 0; i < this.rows.length; ++i) {
            if (this.rows[i][i] !== sym) {
                didWin = false;
                break;
            }
        }
        if (didWin) return true;

        // Top-left to bottom-right
        didWin = true;
        for (let i = 0; i < this.rows.length; ++i) {
            if (this.rows[this.rows.length-1-i][i] !== sym) {
                didWin = false;
                break;
            }
        }
        
        return didWin;
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

