import Piece from './piece';

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        return this.loopOverRowsAndCols(board, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
    }
}
