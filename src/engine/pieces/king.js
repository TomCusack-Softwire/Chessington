import Piece from './piece';
import Square from "../square";

export default class King extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = [];

        for (let rowDir of [-1, 0, 1]) {
            for (let colDir of [-1, 0, 1]) {
                let square = Square.at(position.row + rowDir, position.col + colDir);
                if ((rowDir !== 0 || colDir !== 0) && Square.isValid(square.row, square.col)) {
                    available.push(square);
                }
            }
        }

        return available;
    }
}
