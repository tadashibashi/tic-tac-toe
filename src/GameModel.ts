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

    setWinner(sym: Sym) {
        this.reducer(GameAction.SetWinner, sym, true);
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
                let message;
                switch(data) {
                    case Sym.O:
                        message = "Player O Won!";
                        break;
                    case Sym.X:
                        message = "Player X Won!";
                        break;
                    case Sym.Null:
                        message = "Cats Game!";
                        break;
                }
                return {
                    board: lastState.board.copy(),
                    message,
                    gameState: State.Result
                }
            }


            case GameAction.Reset: {
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