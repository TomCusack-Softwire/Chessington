import Piece from './piece';
import Square from "../square";

export default class Knight extends Piece {
    constructor(player) {
        super(player);
    }
    

    getAvailableMoves(board) {
        return this.checkAllRowsAndCols(board, [[1,2],[1,-2],[-1,2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]]);
    }
}
