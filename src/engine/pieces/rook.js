import Piece from './piece';
import Square from "../square";

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = [];

        for (let [rowDir, colDir] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let row = position.row + rowDir;
            let col = position.col + colDir;
            let square = Square.at(row, col);
            while (Square.isValid(row, col) && board.getPiece(square) === undefined) {
                available.push(square);
                row += rowDir;
                col += colDir;
                square = Square.at(row, col);
            }
            // if other player's piece is there, can also take
            if (Square.isValid(row, col) && board.getPiece(square).player !== this.player) {
                available.push(square);
            }
        }

        return available;
    }
}
