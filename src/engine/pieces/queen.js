import Piece from './piece';
import Square from "../square";

export default class Queen extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = [];
        // Rook
        for (let counter = 0; counter < 8; counter++) {
            if (counter !== position.row) {
                available.push(Square.at(counter, position.col));
            }
            if (counter !== position.col) {
                available.push(Square.at(position.row, counter));
            }
        }
        // Bishop
        for (let rowDir of [1, -1]) {
            for (let colDir of [1, -1]) {
                let row = position.row + rowDir;
                let col = position.col + colDir;
                while (0 <= row && row < 8 && 0 <= col && col < 8) {
                    available.push(Square.at(row, col));
                    row += rowDir;
                    col += colDir;
                }
            }
        }
        return available;
    }
}
