import Square from "../square";

export default class Piece {
    constructor(player) {
        this.player = player;
    }

    getAvailableMoves(board) {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    moveTo(board, newSquare) {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
    }

    loopOverRowsAndCols(board, rowsAndCols) {
        // given 'this' [[rowDir1, colDir1], ...], loop through all available moves
        let position = board.findPiece(this);
        let available = [];
        for (let [rowDir, colDir] of rowsAndCols) {
            let row = position.row + rowDir;
            let col = position.col + colDir;
            let square = Square.at(row, col);
            while (Square.isValid(row, col) && board.getPiece(square) === undefined) {
                available.push(square);
                row += rowDir;
                col += colDir;
                square = Square.at(row, col);
            }

            if (Square.isValid(row, col)) {
                let piece = board.getPiece(square); // piece on last square
                if (piece && piece.player !== this.player && piece.constructor.name !== "King") {
                    available.push(square);
                }
            }
        }
        return available;
    }
}
