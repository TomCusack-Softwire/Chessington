import Piece from './piece';
import Square from "../square";

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        return this.loopOverRowsAndCols(board, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }
}
