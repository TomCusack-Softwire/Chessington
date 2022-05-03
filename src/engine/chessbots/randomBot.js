import Bot from "./bot";

export default class RandomBot extends Bot {
    constructor(player) {
        super(player);
    }

    playMove(board) {
        let possibleMoves = board.getAllAvailableMoves();

        let randomNumber = Math.floor(Math.random() * possibleMoves.length);
        let move = possibleMoves[randomNumber];
        console.log("Moved: " + move);
        board.movePiece(move[0], move[1]);
    }
}