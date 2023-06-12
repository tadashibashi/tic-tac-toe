import {Model} from "./Engine/Model";
import {Board, Sym} from "./Board";


interface GameProps {
    boardEl: HTMLElement,
    displayEl: HTMLElement,
    resetBtnEl: HTMLElement
}


export enum State {
    Start,
    P1Turn,
    P2Turn,
    Result // Show result text, play again?
}


interface GameState {
    board: Board;
    message: string;
    gameState: State;
}


enum GameAction {
    SetBoard,
    SetMessage,
    SetWinner,
    Reset,
}


export class GameModel extends Model<GameState, GameProps, GameAction> {
    constructor() {
        const props = {
            // initialize html elements
            boardEl: document.getElementById("board"),
            displayEl: document.getElementById("display"),
            resetBtnEl: document.getElementById("reset-btn"),
        };

        const state = {
          board: new Board(),
          message: "Welcome",
          gameState: State.Start
        };

        super(state, props);
    }


    setSym(row: number, col: number, sym: Sym) {
        this.reducer(GameAction.SetBoard, {row, col, sym}, true);
    }

    setMessage(message: string) {
        this.reducer(GameAction.SetMessage, message, true);
    }

    setWinner(data:{sym: Sym, squares?: {row: number, col: number}[]}) {
        this.reducer(GameAction.SetWinner, data, true);
    }

    reset() {
        this.reducer(GameAction.Reset, null, true);
    }

    reducerImpl(action: GameAction, data: any, lastState: GameState): GameState {

        switch(action) {

            case GameAction.SetBoard: {
                const newState = {
                    board: lastState.board.copy(),
                    message: lastState.message,
                    gameState: lastState.gameState
                };

                if (data.sym === Sym.O) {
                    newState.message = "Player X's Turn";
                    newState.gameState = State.P2Turn;
                } else {
                    newState.message = "Player O's Turn";
                    newState.gameState = State.P1Turn;
                }

                newState.board.set(data.row, data.col, data.sym);

                return newState;
            }


            case GameAction.SetMessage: {
                return {
                    board: lastState.board.copy(),
                    message: data as string,
                    gameState: lastState.gameState
                };
            }


            case GameAction.SetWinner: {
                let message, color;
                switch(data.sym) {
                    case Sym.O:
                        message = "Player O Won!";
                        color = "green";
                        break;
                    case Sym.X:
                        message = "Player X Won!";
                        color = "red";
                        break;
                    case Sym.Null:
                        message = "Cats Game!";
                        color = "gray";
                        break;
                }

                if (data.sym === Sym.Null) {
                    for (let i = 0; i < 9; ++i) {
                        const sqEl = this.props.boardEl.children[i] as HTMLElement;
                        sqEl.style.background = color;
                        console.log(color);
                    }
                } else {
                    if (data.squares) {
                        data.squares.forEach(sq => {
                            const sqEl = this.props.boardEl.children[sq.row * 3 + sq.col] as HTMLElement;
                            sqEl.style.background = color;
                        });
                    }
                }

                return {
                    board: lastState.board.copy(),
                    message,
                    gameState: State.Result
                };
            }


            case GameAction.Reset: {
                for (let i = 0; i < 9; ++i) {
                    const sqEl = this.props.boardEl.children[i] as HTMLElement;
                    sqEl.style.background = "white";
                }

                return {
                    board: new Board(),
                    message: "Player O's Turn",
                    gameState: State.P1Turn
                }
            }


            default:
                return lastState;
        }
    }

}