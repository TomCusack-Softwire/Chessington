import Piece from './piece';
import Square from "../square";

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = [];

        for (let rowDir of [1, -1]) {
            for (let colDir of [1, -1]) {
                let row = position.row + rowDir;
                let col = position.col + colDir;
                while (Square.isValid(row, col)) {
                    available.push(Square.at(row, col));
                    row += rowDir;
                    col += colDir;
                }
            }
        }

        return available;
    }
}
