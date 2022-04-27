import Piece from './piece';
import Square from "../square";

export default class Knight extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = [];

        function checkAndAdd(row, col) {
            if (Square.isValid(row, col)) {
                available.push(Square.at(row, col));
            }
        }

        checkAndAdd(position.row + 1, position.col + 2);
        checkAndAdd(position.row + 1, position.col - 2);
        checkAndAdd(position.row - 1, position.col + 2);
        checkAndAdd(position.row - 1, position.col - 2);

        checkAndAdd(position.row + 2, position.col + 1);
        checkAndAdd(position.row + 2, position.col - 1);
        checkAndAdd(position.row - 2, position.col + 1);
        checkAndAdd(position.row - 2, position.col - 1);

        return available;
    }
}
