import Piece from './piece';
import GameSettings from "../gameSettings";
import Square from "../square";

export default class King extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = this.checkAllRowsAndCols(board, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);

        // castling
        if (!this.hasMoved) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                let direction = (col < position.col) ? -1 : 1;
                let piece = board.getPiece(Square.at(position.row, col));
                if (piece && piece.constructor.name === "Rook" && !piece.hasMoved && board.freeSpace(Square.at(position.row, position.col + direction)) && board.freeSpace(Square.at(position.row, position.col + 2 * direction))) {
                    available.push(Square.at(position.row, position.col + 2 * direction));
                }
            }
        }

        return available;
    }
}
