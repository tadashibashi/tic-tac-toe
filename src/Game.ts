import { GameView, GameProps } from "./GameView";
import {BoardResult, Sym} from "./Board";

enum GameState {
    Start,
    P1Turn,
    P2Turn,
    Result // Show result text, play again?
}

interface GridPoint {
    row: number;
    col: number;
}

function parseGridId(id: string, pos?: GridPoint): GridPoint {
    const ret: Partial<GridPoint> = pos ? pos : {};
    ret.row = Number(id[1]);
    ret.col = Number(id[3]);

    return ret as GridPoint;
}

export class Game {
    private mView: GameView | null;
    private mState: GameState;
    constructor() {
        this.mView = null;
        this.mState = GameState.Start;
        this.init();
    }

    private wasInit(): boolean {
        return this.mView !== null;
    }

    private init() {
        if (this.wasInit()) return;

        // initialize html elements
        const boardEl = document.getElementById("board");
        const displayEl = document.getElementById("display");

        // connect listeners to objects
        boardEl.addEventListener("click", (evt) => {
            const target = evt.target as HTMLElement;
            if (target === boardEl) // No propagated clicks to Board element should pass
                return;

            const pos = parseGridId(target.getAttribute("id"));

            switch(this.mState) {
                case GameState.Start:
                    this.mState = GameState.P1Turn;
                    this.mView.setMessage("Player O's Turn");
                    break;
                case GameState.P1Turn:
                case GameState.P2Turn:
                    this.statePlayerTurn(pos.row, pos.col,
                        this.mState === GameState.P1Turn ? Sym.O : Sym.X);
                    break;
            }
        });

        // create view
        const props: GameProps = {
            boardEl, displayEl
        };

        this.mView = new GameView(props);
    }


    private statePlayerTurn(row: number, col: number, sym: Sym) {
        if (!this.mView.state.board.spaceEmpty(row, col))
            return;

        this.mView.setSym(row, col, sym);

        const winState = this.mView.state.board.checkWin(sym);
        if (winState === BoardResult.X || winState === BoardResult.O) {
            this.mView.setWinner(sym);
            this.mState = GameState.Result;
        } else if (winState === BoardResult.Cats) {
            this.mView.setWinner(Sym.Null);
            this.mState = GameState.Result;
        } else {
            this.mState = sym === Sym.O ? GameState.P2Turn : GameState.P1Turn;
        }

    }

    run() {

    }





    private loop() { // maybe better to store state
        // Player O goes

        // Check win

        // Player X goes Computer
            // Will player O win?
                // block
            // else
                // try to connect 3

        // Check win
    }
}