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
            const gameState = this.model.state.gameState;
            switch(gameState) {
                case State.Start:
                    this.model.reset();
                    resetBtnEl.innerText = "Reset Game";
                    break;
                case State.P1Turn:
                case State.P2Turn:
                    target.classList.add("pop-in");
                    this.statePlayerTurn(pos.row, pos.col,
                        gameState === State.P1Turn ? Sym.O : Sym.X);
                    break;
            }
        });

        boardEl.addEventListener("animationend", evt => {
           const target = evt.target as HTMLElement;
           if (target === boardEl) return;

           if (evt.animationName === "pop-in") {
               target.classList.remove("pop-in");
           }
        });

        resetBtnEl.addEventListener("click", evt => {
            //const target = evt.target as HTMLButtonElement;
            this.model.reset();
            resetBtnEl.innerText = "Reset Game";
        });
    }


    private statePlayerTurn(row: number, col: number, sym: Sym) {
        if (!this.model.state.board.spaceEmpty(row, col))
            return;

        this.model.setSym(row, col, sym);

        const winState = this.model.state.board.checkWin(sym);
        if (winState.result === BoardResult.X || winState.result === BoardResult.O)
            this.model.setWinner({sym, squares: winState.squares});
        else if (winState.result === BoardResult.Cats)
            this.model.setWinner({sym: Sym.Null});
    }


    // TODO: Nice to have, maybe implement later...
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