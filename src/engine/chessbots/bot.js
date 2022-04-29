export default class Bot {
    constructor(player) {
        this.player = player;
    }

    playMove(board) {
        throw new Error("Please implement this when extending the class.");
    }
}
