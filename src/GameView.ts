import { Board, Sym } from "./Board";
import { View } from "./View";

export interface GameProps {
    boardEl: HTMLElement,
    displayEl: HTMLElement
}

interface GameState {
    board: Board;
    message: string;
}

enum GameAction {
    SetBoard,
    SetMessage,
    SetWinner,
    Reset,
}

function gameReducer(action: GameAction, data: any, lastState: GameState): GameState
{
    switch(action) {
        case GameAction.SetBoard: {
            const newState = {
                board: lastState.board.copy(),
                message: lastState.message,
            };

            if (Array.isArray(data)) {
                if (data.length > 0) {
                    newState.message = (data[0].sym === Sym.O) ? "Player X's Turn" : "Player O's Turn";
                } else {
                    return lastState;
                }
                data.forEach(piece => {
                    newState.board.set(piece.row, piece.col, piece.sym);
                });

            } else {
                newState.board.set(data.row, data.col, data.sym);
                newState.message = (data.sym === Sym.O) ? "Player X's Turn" : "Player O's Turn";
            }

            return newState;
        }
        case GameAction.SetMessage: {
            return {
                board: lastState.board.copy(),
                message: data as string
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
                message
            }
        }
        default:
            return lastState;
    }
}

export class GameView extends View<GameProps, GameState, GameAction> {

    constructor(defaultProps: GameProps, defaultState?: GameState) {
        const props = defaultProps;
        const state = defaultState ||
            {
                board: new Board(),
                message: "Welcome",
            };

        super(props, state);

        this.setReducer(gameReducer);
        this.render();
    }

    setSym(row: number, col: number, sym: Sym) {
        this.reducer(GameAction.SetBoard, {row, col, sym});
    }

    setMessage(message: string) {
        this.reducer(GameAction.SetMessage, message);
    }

    setWinner(sym: Sym) {
        this.reducer(GameAction.SetWinner, sym);
    }

    public render() {
        this.props.displayEl.innerText = this.state.message;

        const squares = this.props.boardEl.children;
        this.state.board.forEachRow((row, rowNum) => {

            for (let colNum = 0; colNum < 3; ++colNum) {
                const square = squares[rowNum * 3 + colNum] as HTMLElement;
                switch(row[colNum]) {
                    case Sym.O:
                        square.innerText = "O"
                        break;
                    case Sym.X:
                        square.innerText = "X";
                        break;
                }
            }
        });
    }

}

