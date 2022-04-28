import Piece from './piece';

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMovesWithoutCheck(board) {
        return this.loopOverRowsAndCols(board, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
    }
}
