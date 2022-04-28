import Square from "../square";

export default class Piece {
    constructor(player) {
        this.player = player;
        this.hasMoved = false;
    }

    getAvailableMoves(board) {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    moveTo(board, newSquare) {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
    }

    canCapture(otherPiece) {
        // is piece the other color and not a king
        return otherPiece && otherPiece.player !== this.player && otherPiece.constructor.name !== "King";
    }

    canMove(board, square, allowCaptures=true) {
        return board.freeSpace(square) || (allowCaptures && Square.isValid(square) && this.canCapture(board.getPiece(square)));
    }

    checkAllRowsAndCols(board, rowsAndCols) {
        // given [[rowOffset1, colOffset1], ...] 'offsets', check which are valid moves
        let position = board.findPiece(this);
        let available = [];
        for (let [rowOffset, colOffset] of rowsAndCols) {
            let square = Square.at(position.row + rowOffset, position.col + colOffset);
            if (Square.isValid(square) && this.canMove(board, square)) {
                available.push(square);
            }
        }
        return available;
    }

    loopOverRowsAndCols(board, rowsAndCols) {
        // given [[rowDir1, colDir1], ...] 'direction vectors', loop through all available moves
        let position = board.findPiece(this);
        let available = [];
        for (let [rowDir, colDir] of rowsAndCols) {
            let row = position.row + rowDir;
            let col = position.col + colDir;
            let square = Square.at(row, col);
            while (board.freeSpace(square)) {
                available.push(square);
                row += rowDir;
                col += colDir;
                square = Square.at(row, col);
            }

            // test last square (either filled or out of bounds, since loop terminated)
            if (this.canMove(board, square)) {
                available.push(square);
            }
        }
        return available;
    }
}
