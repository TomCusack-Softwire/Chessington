import Piece from './piece';

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        return this.loopOverRowsAndCols(board, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }
}
