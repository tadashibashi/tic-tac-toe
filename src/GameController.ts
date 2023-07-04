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


    /**
     * A cross attack happens after turn 3, so there should only be 3 pieces on the board,
     * and in a diagonal formation.
     * @param sym
     * @private
     * @returns 0 for no cross attack,
     * @returns 1 for diagonal containing alternating pieces e.g.: [x, o, x], or [o, x, o],
     * @returns 2 for diagonal containing two in a row e.g.: [x, x, o], [o, o, x], etc.
     */
    private detectCrossAttack(sym: Sym): number {

        let numPieces = 0;
        const board = this.model.state.board;

        for (let row = 0; row < 3; ++row) {
            for (let col = 0; col < 3; ++col) {
                if (board.get(row, col) !== 0)
                    ++numPieces;
            }
        }

        if (numPieces !== 3) return 0;

        // Diagonal check: 0=no diagonal, 1=top-left to bottom-right, 2=bottom-left to top-right
        let isDiagonal = 0;
        let temp = true;
        for (let i = 0; i < 3; ++i) {
            if (this.model.state.board.get(i, i) === 0) {
                temp = false;
                break;
            }
        }
        if (temp)
            isDiagonal = 1;
        else {
            temp = true;
            for (let i = 0; i < 3; ++i) {
                if (this.model.state.board.get(2-i, i) === 0) {
                    temp = false;
                    break;
                }
            }

            if (temp)
                isDiagonal = 2;
        }

        // Check for cross attack v1
        if (isDiagonal === 1) {
            // diag top-left, bottom-right
            if (board.get(0, 0) !== 0 &&
                board.get(0, 0) !== sym &&
                board.get(1, 1) === sym &&
                board.get(2, 2) !== 0 &&
                board.get(2, 2) !== sym)
                return 1;
        } else if (isDiagonal === 2) {
            // diag bottom-left, top-right
            if (board.get(2, 0) !== 0 &&
                board.get(2, 0) !== sym &&
                board.get(1, 1) === sym &&
                board.get(0, 2) !== 0 &&
                board.get(0, 2) !== sym)
                return 1;
        }

        // if diagonal and not a v1 cross attack, it is a v2
        return isDiagonal ? 2 : 0;
    }

    /**
     * Gets the next optimal move cell for a player
     * @param sym {Sym} the player to get the next optimal move for
     * @private
     */
    private optimalCell(sym: Sym): GridPoint {
        const board = this.model.state.board;

        // check for and mitigate cross attack
        const crossAttack = this.detectCrossAttack(sym);
        if (crossAttack === 1) {                  // cross-attack v1, place on sides
            if (board.spaceEmpty(0, 1))
                return {row: 0, col: 1};
            else if (board.spaceEmpty(1, 0))
                return {row: 1, col: 0};
            else if (board.spaceEmpty(2, 1))
                return {row: 2, col: 1};
            else if (board.spaceEmpty(1, 2))
                return {row: 1, col: 2};
        } else if (crossAttack === 2) {           // cross-attack v2, place on corners
            console.log("cross attack v2!");
            if (board.spaceEmpty(0, 0))
                return {row: 0, col: 0};
            else if (board.spaceEmpty(2, 0))
                return {row: 2, col: 0};
            else if (board.spaceEmpty(2, 2))
                return {row: 2, col: 2};
            else if (board.spaceEmpty(0, 2))
                return {row: 0, col: 2};
        }

        // get optimal move
        const playerMove = board.nextOptimalMove(Sym.O);
        const compMove = board.nextOptimalMove(Sym.X);

        // TODO: there is a special case, see Board.test.ts test "Board rateCell5" where
        // algorithm fails to choose winning cell, we might need to create a check will win function that returns that
        // cell first, and then check for optimal move.
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
                    if (gameState === State.P2Turn && this.model.props.computerP2) { // computer move
                        // do nothing... perhaps write inverse if statement?
                    } else {                                                         // player move
                        target.classList.add("pop-in");
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
            resetBtnEl.innerText = "Reset";
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
                resetBtnEl.innerText = "Reset";
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