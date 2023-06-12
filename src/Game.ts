import { GameModel } from "./GameModel";
import { GameView } from "./GameView";
import { GameController } from "./GameController";

// Sets up game and owns MVC
class Game {
    model: GameModel;
    view: GameView;
    controller: GameController;

    constructor() {
        this.model = new GameModel();
        this.view = new GameView(this.model);
        this.controller = new GameController(this.model);
    }
}

let game;
window.onload = function() {
    game = new Game();
}
