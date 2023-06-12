import { GameView } from "./GameView";
import {BoardResult, Sym} from "./Board";
import {GameModel, State} from "./GameModel";

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

export class GameController {
    private model: GameModel;
    constructor(model: GameModel) {
        this.model = model;
        this.init();
    }

    private init() {
        const boardEl = this.model.props.boardEl;
        const resetBtnEl = this.model.props.resetBtnEl;

        // connect listeners to objects
        boardEl.addEventListener("click", (evt) => {
            const target = evt.target as HTMLElement;
            if (target === boardEl) // No propagated clicks to Board element should pass
                return;

            const pos = parseGridId(target.getAttribute("id"));
            console.log(pos);
            const gameState = this.model.state.gameState;
            switch(gameState) {
                case State.Start:
                    this.model.reset();
                    break;
                case State.P1Turn:
                case State.P2Turn:
                    this.statePlayerTurn(pos.row, pos.col,
                        gameState === State.P1Turn ? Sym.O : Sym.X);
                    break;
            }
        });

        resetBtnEl.addEventListener("click", evt => {
            //const target = evt.target as HTMLButtonElement;

            this.model.reset();
        });
    }


    private statePlayerTurn(row: number, col: number, sym: Sym) {
        if (!this.model.state.board.spaceEmpty(row, col))
            return;

        this.model.setSym(row, col, sym);

        const winState = this.model.state.board.checkWin(sym);
        if (winState === BoardResult.X || winState === BoardResult.O) {
            this.model.setWinner(sym);
        } else if (winState === BoardResult.Cats) {
            this.model.setWinner(Sym.Null);
        }
    }


    private computerAi() { // maybe better to store state
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