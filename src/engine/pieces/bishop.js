import Piece from './piece';

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMovesWithoutCheck(board) {
        return this.loopOverRowsAndCols(board, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }
}
