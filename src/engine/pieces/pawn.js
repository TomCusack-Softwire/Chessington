import Piece from './piece';
import Player from "../player";
import Square from "../square";

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let sign = (this.player === Player.WHITE ? 1 : -1);
        let available = [];

        let square1 = Square.at(position.row + sign, position.col);
        let square2 = Square.at(position.row + 2 * sign, position.col);

        if (board.freeSpace(square1)) {
            available.push(square1);
            if (board.freeSpace(square2) && ((this.player === Player.WHITE && position.row === 1) || (this.player === Player.BLACK && position.row === 6))) {
                available.push(square2);
            }
        }

        // capture
        for (let capture_side of [1, -1]) {
            let square = Square.at(position.row + sign, position.col + capture_side);
            if (Square.isValid(square) && this.canCapture(board.getPiece(square))) {
                available.push(square);
            }
        }

        return available;
    }
}
