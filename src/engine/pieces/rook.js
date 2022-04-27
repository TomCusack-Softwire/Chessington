import Piece from './piece';
import Square from "../square";

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let position = board.findPiece(this);
        let available = [];
        for (let counter = 0; counter < 8; counter++) {
            if (counter !== position.row) {
                available.push(Square.at(counter, position.col));
            }
            if (counter !== position.col) {
                available.push(Square.at(position.row, counter));
            }
        }
        return available;
    }
}
