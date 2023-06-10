import { Board, Symbol } from "./Board";
import { View } from "./View";

interface GameProps {

}

interface GameState {
    board: Board;
}

enum GameAction {
    SetBoard,
    SetMessage,
    Reset,
}

function gameReducer(action: GameAction.SetBoard, data: {row: number, col: number, sym: Symbol}[] | {row: number, col: number, sym: Symbol}, lastState: GameState): GameState;
function gameReducer(action: GameAction, data: any, lastState: GameState): GameState {
    switch(action) {
        case GameAction.SetBoard: {
            const newState = {
                board: lastState.board.copy()
            };

            if (Array.isArray(data)) {
                data.forEach(piece => {
                    newState.board.set(piece.row, piece.col, piece.sym);
                });
            } else {
                newState.board.set(data.row, data.col, data.sym);
            }

            return newState;
        }
        break;
        default:
            return lastState;
        break;
    }
}

export class GameView extends View<GameProps, GameState, GameAction> {

    constructor(defaultProps?: GameProps, defaultState?: GameState) {
        const props = defaultProps || {};
        const state = defaultState || {board: new Board()};

        super(props, state);

        this.setReducer(gameReducer);
    }

    set(row: number, col: number, sym: Symbol) {
        if (this.state)
        this.reducer(GameAction.SetBoard, {row, col, sym});
    }

    public render(): () => void {
        throw new Error("Method not implemented.");
    }

}

