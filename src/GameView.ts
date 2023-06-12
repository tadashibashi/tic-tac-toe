import { Board, Sym } from "./Board";
import { View } from "./Engine/View";
import {GameModel} from "./GameModel";


export class GameView extends View<GameModel> {

    constructor(model: GameModel) {
        super(model);
    }

    renderImpl(model: GameModel) {
        model.props.displayEl.innerText = model.state.message;

        const squares = model.props.boardEl.children;
        model.state.board.forEachRow((row, rowNum) => {

            for (let colNum = 0; colNum < 3; ++colNum) {
                const square = squares[rowNum * 3 + colNum] as HTMLElement;
                switch(row[colNum]) {
                    case Sym.O:
                        square.innerText = "O"
                        break;
                    case Sym.X:
                        square.innerText = "X";
                        break;
                    case Sym.Null:
                        square.innerText = "";
                }
            }
        });
    }

}

