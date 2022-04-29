import Bot from "./bot";
import GameSettings from "../gameSettings";
import Square from "../square";

export default class RandomBot extends Bot {
    constructor(player) {
        super(player);
    }

    playMove(board) {
        let possibleMoves = [];
        for (let row = 0; row < GameSettings.BOARD_SIZE; row++) {
            for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
                let square = Square.at(row, col);
                let piece = board.getPiece(square);
                if (piece) {
                    for (let newSquare of piece.getAvailableMoves(board)) {
                        possibleMoves.push([square, newSquare]);
                    }
                }
            }
        }
        if (possibleMoves.length > 0) {
            let randomNumber = Math.floor(Math.random() * possibleMoves.length);
            let move = possibleMoves[randomNumber];
            board.movePiece(move[0], move[1]);
        }
    }
}