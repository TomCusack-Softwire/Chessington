import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Queen from "./pieces/queen";
import Piece from "./pieces/piece";

export default class Board {
    constructor(currentPlayer, checkForEndgame=true) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
        this.lastMove = [undefined, undefined]; // [fromSquare, toSquare]
        this.bots = { // undefined = human player
            "WHITE": undefined,
            "BLACK": undefined,
        };
        this.finishReason = undefined;
        this.checkForEndgame = checkForEndgame;

        // for threefold repetition and fifty move rule
        this.history = [];
    }

    setBot(player, bot) {
        if (player === "WHITE") {
            this.bots["WHITE"] = new bot(Player.WHITE);
        } else if (player === "BLACK") {
            this.bots["BLACK"] = new bot(Player.BLACK);
        }
    }

    printBoard(log=true) {
        // for debugging purposes
        let message = "";
        for (let row = GameSettings.BOARD_SIZE - 1; row >= 0; row--) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                let piece = this.board[row][col];
                if (piece === undefined) {
                    message += " ";
                } else if (piece.player === Player.WHITE) {
                    message += piece.constructor.name.slice(0, 1).toLowerCase();
                } else {
                    message += piece.constructor.name.slice(0, 1).toUpperCase();
                }
            }
            message += "\n";
        }
        if (log) {
            console.log("--------\n" + message + "--------");
        }
        return message;
    }

    createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }

    copyBoard() {
        const simulated = new Board(this.currentPlayer);
        for (let row = 0; row < GameSettings.BOARD_SIZE; row++) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                let square = Square.at(row, col);
                if (this.getPiece(square)) {
                    simulated.setPiece(square, this.getPiece(square));
                }
            }
        }
        return simulated;
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

    movePiece(fromSquare, toSquare, printMove=true) {
        let movingPiece = this.getPiece(fromSquare);
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {

            let destinationIsFree = this.freeSpace(toSquare);

            // en passant removal
            if (movingPiece.constructor.name === "Pawn" && destinationIsFree && fromSquare.row !== toSquare.row && fromSquare.col !== toSquare.col) {
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

            if (this.checkForEndgame) {
                // check for end games
                if (this.getAllAvailableMoves().length === 0) {
                    let king = Piece.getKing(this, this.currentPlayer);
                    this.finishReason = (king && king.isInCheck(this)) ? "Checkmate!" : "Stalemate! (No legal moves left)";
                    return;
                }
                // repetitions: add Board(string) to history. Delete history on pawn move or capture (non-takeback-able)
                let moveString = this.printBoard(false);
                if (!destinationIsFree) {
                    if (movingPiece.constructor.name === "Pawn") {
                        this.history = [moveString];
                    }

                    // check for draw (on capture)
                    let pieces = this.getAllAvailablePieces(true)
                        .map(piece => piece.constructor.name + (piece.isOnLightSquare(this) ? "L" : "D"))
                        .filter(piece => piece.slice(0, -1) !== "King");

                    if (pieces.length === 0 ||
                        (pieces.length === 1 && ["Bishop", "Knight"].includes(pieces[0].slice(0, -1))) ||
                        (pieces.length === 2 && pieces[0].slice(0, -1) === "Bishop" && pieces[0] === pieces[1])) {

                        this.finishReason = "Stalemate! (Insufficient material)";
                        return;
                    }

                } else {
                    this.history.push(moveString);
                    let count = 0;
                    for (let state of this.history) {
                        if (moveString === state) {
                            count++;
                        }
                    }
                    if (count >= 3) {
                        this.finishReason = "Stalemate! (Threefold repetition)";
                        return;
                    }
                    if (this.history.length >= 50) {
                        this.finishReason = "Stalemate! (50 move rule)";
                        return;
                    }
                }
            }

            // game continues. If bot, get it to play (after 0.5s)
            let next_player = this.currentPlayer.description.toUpperCase();
            if (this.bots[next_player]) {
                const board = this;
                setTimeout(() => board.bots[next_player].playMove(board), 500);
            }
        }
    }

    freeSpace(square) {
        return Square.isValid(square) && this.getPiece(square) === undefined;
    }

    getAllAvailablePieces(friendlyPieces=false) {
        let pieces = [];
        for (let row = 0; row < GameSettings.BOARD_SIZE; row++) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                let piece = this.getPiece(Square.at(row, col));
                if (piece && (friendlyPieces || piece.player === this.currentPlayer)) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    getAllAvailableMoves() {
        let moves = [];
        for (let piece of this.getAllAvailablePieces()) {
            let fromSquare = this.findPiece(piece);
            for (let toSquare of piece.getAvailableMoves(this)) {
                moves.push([fromSquare, toSquare]);
            }
        }
        return moves;
    }
}
