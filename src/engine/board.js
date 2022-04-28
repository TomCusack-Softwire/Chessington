import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Queen from "./pieces/queen";

export default class Board {
    constructor(currentPlayer) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
        this.lastMove = [undefined, undefined]; // [fromSquare, toSquare]
    }

    printBoard() {
        // for debugging purposes
        let message = "--------\n";
        for (let row = GameSettings.BOARD_SIZE - 1; row >= 0; row--) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                let piece = this.board[row][col];
                if (piece === undefined) {
                    message += " ";
                } else {
                    if (piece.player === Player.WHITE) {
                        message += piece.constructor.name.slice(0, 1).toLowerCase();
                    } else {
                        message += piece.constructor.name.slice(0, 1).toUpperCase();
                    }
                }
            }
            message += "\n";
        }
        message += "--------\n";
        console.log(message);
        return message;
    }

    createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }

    setPiece(square, piece) {
        this.board[square.row][square.col] = piece;
    }

    getPiece(square) {
        return this.board[square.row][square.col];
    }

    findPiece(pieceToFind) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    movePiece(fromSquare, toSquare) {
        let movingPiece = this.getPiece(fromSquare);
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {

            // en passant removal
            if (movingPiece.constructor.name === "Pawn" && this.freeSpace(toSquare) && fromSquare.row !== toSquare.row && fromSquare.col !== toSquare.col) {
                this.setPiece(Square.at(fromSquare.row, toSquare.col), undefined);
            }

            // pawn promotion
            if (movingPiece.constructor.name === "Pawn" && (toSquare.row === 0 || toSquare.row === GameSettings.BOARD_SIZE - 1)) {
                movingPiece = new Queen(movingPiece.player);
            }

            // castling rook
            if (movingPiece.constructor.name === "King" && Math.abs(fromSquare.col - toSquare.col) === 2) {
                let direction = (fromSquare.col < toSquare.col) ? 1 : -1;
                let rook_col = toSquare.col;
                let square = toSquare;

                while (Square.isValid(square) && (!this.getPiece(square) || this.getPiece(square).constructor.name !== "Rook")) {
                    rook_col += direction;
                    square = Square.at(square.row, rook_col);
                }
                if (!Square.isValid(square)) {
                    throw new Error("No rook found! Invalid move.");
                }
                let rook = this.getPiece(square);
                this.setPiece(Square.at(toSquare.row, toSquare.col - direction), rook);
                this.setPiece(square, undefined);
                rook.hasMoved = true;
            }

            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);

            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
            this.lastMove = [fromSquare, toSquare];
            movingPiece.hasMoved = true;
        }
    }

    freeSpace(square) {
        return Square.isValid(square) && this.getPiece(square) === undefined;
    }
}
