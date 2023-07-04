import {BoardResult, Sym} from "./Board";
import {GameModel, State} from "./GameModel";
import Cookie from "js-cookie";

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
        this.computerTimeout = null;
    }

    computerTimeout: NodeJS.Timeout;


    private detectCrossAttack() {
        let numPieces = 0;

        for (let row = 0; row < 3; ++row) {
            for (let col = 0; col < 3; ++col) {
                if (this.model.state.board.get(row, col) !== 0)
                    ++numPieces;
            }
        }

        if (numPieces !== 3) return false;

        // diag top-left, bottom-right
        let cross = true;
        for (let i = 0; i < 3; ++i) {
            if (this.model.state.board.get(i, i) === 0) {
                cross = false;
                break;
            }
        }

        if (cross) return true;

        // diag bottom-left, top-right
        cross = true;
        for (let i = 0; i < 3; ++i) {
            if (this.model.state.board.get(2-i, i) === 0) {
                cross = false;
                break;
            }
        }

        return cross;
    }

    /**
     * Gets the next optimal move cell for a player
     * @param sym {Sym} the player to get the next optimal move for
     * @private
     */
    private optimalCell(sym: Sym): GridPoint {
        const board = this.model.state.board;

        const playerMove = board.nextOptimalMove(Sym.O);
        const compMove = board.nextOptimalMove(Sym.X);

        // mitigate cross attack
        if (this.detectCrossAttack()) {
            if (board.spaceEmpty(0, 1))
                return {row: 0, col: 1};
            else if (board.spaceEmpty(1, 0))
                return {row: 1, col: 0};
            else if (board.spaceEmpty(2, 1))
                return {row: 2, col: 1};
            else if (board.spaceEmpty(1, 2))
                return {row: 1, col: 2};
        }

        if (sym === Sym.O) { // player, if player going to win, prefer player move
            return playerMove.rating >= compMove.rating ?
                {row: playerMove.row, col: playerMove.col} :
                {row: compMove.row, col: compMove.row};
        } else if (sym === Sym.X) { // comp, if comp going to win, prefer comp move
            return compMove.rating >= playerMove.rating ?
                {row: compMove.row, col: compMove.col} :
                {row: playerMove.row, col: playerMove.col};
        } else {
            throw new Error("[GameController.optimalCell]: Sym is an invalid value!");
        }
    }

    private init() {
        const boardEl = this.model.props.boardEl;
        const resetBtnEl = this.model.props.resetBtnEl;
        const compSliderEl = this.model.props.compSliderEl;

        // connect listeners to objects
        boardEl.addEventListener("click", (evt) => {
            const target = evt.target as HTMLElement;
            if (target === boardEl) // No propagated clicks to Board element should pass
                return;

            // grab position from target id
            const pos = parseGridId(target.getAttribute("id"));

            // state machine
            const gameState = this.model.state.gameState;
            switch(gameState) {
                case State.Start:
                    this.model.reset();
                    resetBtnEl.innerText = "Reset Game";
                    break;
                case State.P1Turn:
                case State.P2Turn:
                    target.classList.add("pop-in");

                    if (gameState === State.P2Turn && this.model.props.computerP2) { // computer move

                    } else {
                        this.statePlayerTurn(pos.row, pos.col,
                            gameState === State.P1Turn ? Sym.O : Sym.X);
                    }

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

        compSliderEl.addEventListener("input", evt => {
            this.model.props.computerP2 = compSliderEl.checked;

            Cookie.set("computer-p2", compSliderEl.checked ? "true" : "false", {expires: 365});

            if (compSliderEl.checked && this.model.state.gameState === State.P2Turn) {
                this.computerTurn();
            }
        });

        // set compSlider computer state based on cookie
        const computerP2 = Cookie.get("computer-p2");
        if (computerP2 === "true") {
            compSliderEl.checked = true;
            this.model.props.computerP2 = true;
        }

        // start game in a few seconds
        setTimeout(() => {
            if (this.model.state.gameState !== State.P1Turn) {
                this.model.reset();
                resetBtnEl.innerText = "Reset Game";
            }
        }, 1000);
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

        // player turn ended and computer mode on, trigger computer move!
        if (this.model.state.gameState === State.P2Turn &&
            this.model.props.computerP2 && sym === Sym.O) {
            this.computerTurn();
        }
    }

    private computerTurn() {
        if (this.computerTimeout !== null)
            clearTimeout(this.computerTimeout);

        this.computerTimeout = setTimeout(() => {
            const compMove = this.optimalCell(Sym.X);
            this.statePlayerTurn(compMove.row, compMove.col, Sym.X);
            const el = document.getElementById("r" + compMove.row + "c" + compMove.col);
            el.click();
            this.computerTimeout = null;
        }, 1000);
    }
}