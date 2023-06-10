import { Board, BoardResult, Symbol } from "../src/Board";

test("Board checkWin: horizontal, row 0", () => {
    const board = new Board([
        [Symbol.O, Symbol.O, Symbol.O],
        [Symbol.Null, Symbol.Null, Symbol.Null],
        [Symbol.Null, Symbol.Null, Symbol.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: horizontal, row 1", () => {
    const board = new Board([
        [Symbol.Null, Symbol.Null, Symbol.Null],
        [Symbol.O, Symbol.O, Symbol.O],
        [Symbol.Null, Symbol.Null, Symbol.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: horizontal, row 2", () => {
    const board = new Board([
        [Symbol.Null, Symbol.Null, Symbol.Null],
        [Symbol.Null, Symbol.Null, Symbol.Null],
        [Symbol.O, Symbol.O, Symbol.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: vertical, col 0", () => {
    const board = new Board([
        [Symbol.O, Symbol.Null, Symbol.Null],
        [Symbol.O, Symbol.Null, Symbol.Null],
        [Symbol.O, Symbol.Null, Symbol.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: vertical, col 1", () => {
    const board = new Board([
        [Symbol.Null, Symbol.O, Symbol.Null],
        [Symbol.Null, Symbol.O, Symbol.Null],
        [Symbol.Null, Symbol.O, Symbol.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: vertical, col 2", () => {
    const board = new Board([
        [Symbol.Null, Symbol.Null, Symbol.O],
        [Symbol.Null, Symbol.Null, Symbol.O],
        [Symbol.Null, Symbol.Null, Symbol.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: cross tl-br", () => {
    const board = new Board([
        [Symbol.O, Symbol.Null, Symbol.Null],
        [Symbol.Null, Symbol.O, Symbol.Null],
        [Symbol.Null, Symbol.Null, Symbol.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: cross bl-tr", () => {
    const board = new Board([
        [Symbol.Null, Symbol.Null, Symbol.O,],
        [Symbol.Null, Symbol.O, Symbol.Null],
        [Symbol.O, Symbol.Null, Symbol.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: diff symbols", () => {
    const board = new Board([
        [Symbol.Null, Symbol.Null, Symbol.X],
        [Symbol.Null, Symbol.O, Symbol.Null],
        [Symbol.X, Symbol.Null, Symbol.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.None);
});

test("Board checkWin: diff symbols w/ null", () => {
    const board = new Board([
        [Symbol.Null, Symbol.Null, Symbol.X],
        [Symbol.Null, Symbol.O, Symbol.Null],
        [Symbol.Null, Symbol.Null, Symbol.Null],
    ]);

    expect(board.checkWin()).toBe(BoardResult.None);
});

test("Board checkWin: cats game 1", () => {
    const board = new Board([
        [Symbol.O, Symbol.X, Symbol.X],
        [Symbol.X, Symbol.O, Symbol.O],
        [Symbol.O, Symbol.O, Symbol.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.Cats);
});

test("Board checkWin: cats game 2", () => {
    const board = new Board([
        [Symbol.X, Symbol.O, Symbol.X],
        [Symbol.O, Symbol.X, Symbol.O],
        [Symbol.O, Symbol.X, Symbol.O],
    ]);

    expect(board.checkWin()).toBe(BoardResult.Cats);
});

test("Board checkWin: cats game 3", () => {
    const board = new Board([
        [Symbol.O, Symbol.O, Symbol.X],
        [Symbol.X, Symbol.X, Symbol.O],
        [Symbol.O, Symbol.O, Symbol.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.Cats);
});

test("Board checkWin: almost cats", () => {
    const board = new Board([
        [Symbol.Null, Symbol.O, Symbol.X],
        [Symbol.X, Symbol.X, Symbol.O],
        [Symbol.O, Symbol.O, Symbol.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.None);
});

test("Board checkWin: O wins, full board", () => {
    const board = new Board([
        [Symbol.O, Symbol.O, Symbol.O],
        [Symbol.X, Symbol.X, Symbol.O],
        [Symbol.O, Symbol.O, Symbol.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.O);
});

test("Board checkWin: X wins, full board", () => {
    const board = new Board([
        [Symbol.X, Symbol.O, Symbol.X],
        [Symbol.X, Symbol.X, Symbol.O],
        [Symbol.O, Symbol.O, Symbol.X],
    ]);

    expect(board.checkWin()).toBe(BoardResult.X);
});
