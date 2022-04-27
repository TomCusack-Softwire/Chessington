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
                if (rowDir !== 0 || colDir !== 0) {
                    available.push(Square.at(position.row + rowDir, position.col + colDir));
                }
            }
        }

        return available;
    }
}
