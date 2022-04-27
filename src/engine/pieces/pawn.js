import Piece from './piece';
import Player from "../player";

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentPosition = board.findPiece(this);
        if (this.player === Player.WHITE) {
            currentPosition.row += 1;
        } else {
            currentPosition.row -= 1;
        }
        return [currentPosition];
    }
}
