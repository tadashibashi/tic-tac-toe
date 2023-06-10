
export enum Symbol {
    Null=0,
    X,
    O,
    COUNT
}

export enum BoardResult {
    None,
    X,
    O,
    Cats,
    COUNT
}

export class Board {
    private rows: Symbol[][];

    public constructor(rows?: Symbol[][]) {
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
            [Symbol.Null, Symbol.Null, Symbol.Null],
            [Symbol.Null, Symbol.Null, Symbol.Null],
            [Symbol.Null, Symbol.Null, Symbol.Null]
        ];
    }

    public set(row: number, col: number, sym: Symbol): void {
        this.rows[row][col] = sym;
    }

    public get(row: number, col: number): Symbol {
        return this.rows[row][col];
    }

    public checkWin(): BoardResult {
        if (this.__checkWin(Symbol.X))
            return BoardResult.X;
        else if (this.__checkWin(Symbol.O))
            return BoardResult.O;
        else if (this.__boardFull())
            return BoardResult.Cats;
        else
            return BoardResult.None;
    }

    private __checkWin(sym: Symbol) {
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
                if (this.rows[row][col] === Symbol.Null)
                    return false;
        }

        return true;
    }
}

