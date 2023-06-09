import { Board, Symbol } from "./Board";

window.onload = function() {
    let b = new Board();

    b.set(0, 0, Symbol.O);
    b.set(1, 1, Symbol.O);
    b.set(2, 2, Symbol.O);
    console.log(b.checkWin(Symbol.O));

    alert("Hello world!");

}
