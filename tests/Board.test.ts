import { Board, BoardResult, Sym } from "../src/Board";

test("Board checkWin: horizontal, row 0", () => {
    const board = new Board([
        [Sym.O, Sym.O, Sym.O],
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.Null, Sym.Null, Sym.Null],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 0 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 0 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 0 && s.col === 2)).toBe(true);
});

test("Board checkWin: horizontal, row 1", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.O, Sym.O, Sym.O],
        [Sym.Null, Sym.Null, Sym.Null],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 1 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 2)).toBe(true);
});

test("Board checkWin: horizontal, row 2", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.O, Sym.O, Sym.O],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 2 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 2)).toBe(true);
});

test("Board checkWin: vertical, col 0", () => {
    const board = new Board([
        [Sym.O, Sym.Null, Sym.Null],
        [Sym.O, Sym.Null, Sym.Null],
        [Sym.O, Sym.Null, Sym.Null],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 0 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 0)).toBe(true);
});

test("Board checkWin: vertical, col 1", () => {
    const board = new Board([
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.O, Sym.Null],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 0 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 1)).toBe(true);
});

test("Board checkWin: vertical, col 2", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.O],
        [Sym.Null, Sym.Null, Sym.O],
        [Sym.Null, Sym.Null, Sym.O],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 0 && s.col === 2)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 2)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 2)).toBe(true);
});

test("Board checkWin: cross tl-br", () => {
    const board = new Board([
        [Sym.O, Sym.Null, Sym.Null],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.Null, Sym.O],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 0 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 2)).toBe(true);
});

test("Board checkWin: cross bl-tr", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.O,],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.O, Sym.Null, Sym.Null],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 0 && s.col === 2)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 0)).toBe(true);
});

test("Board checkWin: diff symbols", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.X],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.X, Sym.Null, Sym.Null],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.None);
});

test("Board checkWin: diff symbols w/ null", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.X],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.Null, Sym.Null],
    ]);

    const result = board.checkWin(Sym.O);

    expect(result.result).toBe(BoardResult.None);
});

test("Board checkWin: cats game 1", () => {
    const board = new Board([
        [Sym.O, Sym.X, Sym.X],
        [Sym.X, Sym.O, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin(Sym.O).result).toBe(BoardResult.Cats);
});

test("Board checkWin: cats game 2", () => {
    const board = new Board([
        [Sym.X, Sym.O, Sym.X],
        [Sym.O, Sym.X, Sym.O],
        [Sym.O, Sym.X, Sym.O],
    ]);

    expect(board.checkWin(Sym.O).result).toBe(BoardResult.Cats);
});

test("Board checkWin: cats game 3", () => {
    const board = new Board([
        [Sym.O, Sym.O, Sym.X],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin(Sym.O).result).toBe(BoardResult.Cats);
});

test("Board checkWin: almost cats", () => {
    const board = new Board([
        [Sym.Null, Sym.O, Sym.X],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin(Sym.O).result).toBe(BoardResult.None);
});

test("Board checkWin: O wins, full board", () => {
    const board = new Board([
        [Sym.O, Sym.O, Sym.O],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    const result = board.checkWin(Sym.O);
    expect(result.result).toBe(BoardResult.O);
    expect(result.squares.some(s => s.row === 0 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 0 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 0 && s.col === 2)).toBe(true);
});

test("Board checkWin: X wins, full board", () => {
    const board = new Board([
        [Sym.X, Sym.O, Sym.X],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    const result = board.checkWin(Sym.X);

    expect(result.result).toBe(BoardResult.X);
    expect(result.squares.some(s => s.row === 0 && s.col === 0)).toBe(true);
    expect(result.squares.some(s => s.row === 1 && s.col === 1)).toBe(true);
    expect(result.squares.some(s => s.row === 2 && s.col === 2)).toBe(true);
});

test("Board rateCell0", () => {
    const board = new Board([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]);

    expect(board.rateCell(0, 0, 1)).toBe(9);
    expect(board.rateCell(1, 1, 1)).toBe(12);
    expect(board.rateCell(1, 0, 1)).toBe(6);
});

test("Board rateCell1", () => {
    const board = new Board([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ]) ;

    expect(board.rateCell(0, 0, 1)).toBe(18);
});

test("Board rateCell2", () => {
    const board = new Board([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]) ;

    expect(board.rateCell(1, 1, 1)).toBe(21);
    expect(board.rateCell(0, 2, 1)).toBe(18);
});

test("Board rateCell3 (blocked)", () => {
    const board = new Board([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 2],
    ]);

    expect(board.rateCell(1, 1, 1)).toBe(9);
});

test("Board rateCell4", () => {
    const board = new Board([
        [1, 2, 1],
        [2, 0, 0],
        [0, 0, 0],
    ]);

    expect(board.rateCell(2, 2, 1)).toBe(27);
    expect(board.rateCell(1, 1, 1)).toBe(24);
});

test("Board rateCell: Edge Case... Not sure how to fix", () => {
    const board = new Board([
        [1, 2, 2],
        [0, 1, 0],
        [1, 1, 2],
    ]);

    // It's p2's turn
    // Computer will opt to block 1, instead of finish own win
    expect(board.rateCell(1, 0, 1)).toBe(51);
    expect(board.rateCell(1, 2, 2)).toBe(39);
});
