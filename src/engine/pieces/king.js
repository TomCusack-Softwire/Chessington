import Piece from './piece';
import GameSettings from "../gameSettings";
import Square from "../square";

export default class King extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMovesWithoutCheck(board) {
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

    isInCheck(board) {
        // rook/queen/bishop/pawn
        for (let direction of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
            let specialPiece = direction.includes(0) ? "Rook" : "Bishop";
            let squaresInDirection = this.loopOverRowsAndCols(board, [direction]);
            let last_square = squaresInDirection[squaresInDirection.length - 1];
            if (last_square && Square.isValid(last_square)) {
                let piece = board.getPiece(last_square);
                if (piece && piece.player !== this.player) {
                    if ([specialPiece, "Queen"].includes(piece.constructor.name) || (piece.constructor.name === "Pawn" && squaresInDirection.length === 1)) {
                        return true;
                    }
                }
            }
        }

        // knight
        for (let square of this.checkAllRowsAndCols(board, [[1,2],[1,-2],[-1,2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]])) {
            let piece = board.getPiece(square);
            if (piece && piece.player !== this.player && piece.constructor.name === "Knight") {
                return true;
            }
        }

        return false;
    }
}
