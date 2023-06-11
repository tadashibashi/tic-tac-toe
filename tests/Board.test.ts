import { Board, BoardResult, Sym } from "../src/Board";

test("Board checkWin: horizontal, row 0", () => {
    const board = new Board([
        [Sym.O, Sym.O, Sym.O],
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.Null, Sym.Null, Sym.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: horizontal, row 1", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.O, Sym.O, Sym.O],
        [Sym.Null, Sym.Null, Sym.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: horizontal, row 2", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.Null, Sym.Null, Sym.Null],
        [Sym.O, Sym.O, Sym.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: vertical, col 0", () => {
    const board = new Board([
        [Sym.O, Sym.Null, Sym.Null],
        [Sym.O, Sym.Null, Sym.Null],
        [Sym.O, Sym.Null, Sym.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: vertical, col 1", () => {
    const board = new Board([
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.O, Sym.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: vertical, col 2", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.O],
        [Sym.Null, Sym.Null, Sym.O],
        [Sym.Null, Sym.Null, Sym.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: cross tl-br", () => {
    const board = new Board([
        [Sym.O, Sym.Null, Sym.Null],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.Null, Sym.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: cross bl-tr", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.O,],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.O, Sym.Null, Sym.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: diff symbols", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.X],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.X, Sym.Null, Sym.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.None);
});

test("Board checkWin: diff symbols w/ null", () => {
    const board = new Board([
        [Sym.Null, Sym.Null, Sym.X],
        [Sym.Null, Sym.O, Sym.Null],
        [Sym.Null, Sym.Null, Sym.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.None);
});

test("Board checkWin: cats game 1", () => {
    const board = new Board([
        [Sym.O, Sym.X, Sym.X],
        [Sym.X, Sym.O, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.Cats);
});

test("Board checkWin: cats game 2", () => {
    const board = new Board([
        [Sym.X, Sym.O, Sym.X],
        [Sym.O, Sym.X, Sym.O],
        [Sym.O, Sym.X, Sym.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.Cats);
});

test("Board checkWin: cats game 3", () => {
    const board = new Board([
        [Sym.O, Sym.O, Sym.X],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.Cats);
});

test("Board checkWin: almost cats", () => {
    const board = new Board([
        [Sym.Null, Sym.O, Sym.X],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.None);
});

test("Board checkWin: O wins, full board", () => {
    const board = new Board([
        [Sym.O, Sym.O, Sym.O],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: X wins, full board", () => {
    const board = new Board([
        [Sym.X, Sym.O, Sym.X],
        [Sym.X, Sym.X, Sym.O],
        [Sym.O, Sym.O, Sym.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.X);
});
