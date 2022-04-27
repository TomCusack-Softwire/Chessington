import Piece from './piece';
import Square from "../square";

export default class Knight extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = [];
        let player = this.player;

        function checkAndAdd(row, col) {
            let square = Square.at(row, col);
            if (Square.isValid(row, col)) {
                let piece = board.getPiece(square);
                if (piece === undefined || (piece.player !== player && piece.constructor.name !== "King")) {
                    available.push(square);
                }
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
