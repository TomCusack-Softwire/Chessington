import Square from "../square";
import GameSettings from "../gameSettings";

export default class Piece {
    constructor(player) {
        this.player = player;
        this.hasMoved = false;
    }

    getAvailableMoves(board) {
        let king = this.getKing(board, board.currentPlayer);
        let moves = this.getAvailableMovesWithoutCheck(board);
        if (king === undefined) {
            return moves;
        }
        return moves.filter(newSquare => {
            let simulated = board.copyBoard();
            simulated.movePiece(simulated.findPiece(this), newSquare, false);
            return !king.isInCheck(simulated);
        });
    }

    getAvailableMovesWithoutCheck(board) {
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
            if (this.canMove(board, square)) {
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

    getKing(board, player) {
        for (let row = 0; row < GameSettings.BOARD_SIZE; row++) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                let piece = board.getPiece(Square.at(row, col));
                if (piece && piece.player === player && piece.constructor.name === "King") {
                    return piece;
                }
            }
        }
    }
}
