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

        function checkAndAdd(row, col) {
            let square = Square.at(row, col);
            if (Square.isValid(row, col) && board.getPiece(square) === undefined) {
                available.push(square);
            }
        }

        checkAndAdd(position.row + sign, position.col);
        if (((this.player === Player.WHITE && position.row === 1) || (this.player === Player.BLACK && position.row === 6)) && board.getPiece(Square.at(position.row + sign, position.col)) === undefined) {
            checkAndAdd(position.row + 2 * sign, position.col);
        }

        return available;
    }
}
