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
                let square = Square.at(row, col);
                while (Square.isValid(row, col) && board.getPiece(square) === undefined) {
                    available.push(square);
                    row += rowDir;
                    col += colDir;
                    square = Square.at(row, col);
                }
                if (Square.isValid(row, col) && board.getPiece(square) && board.getPiece(square).player !== this.player) {
                    available.push(square);
                }
            }
        }

        return available;
    }
}
