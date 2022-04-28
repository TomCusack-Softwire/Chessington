import 'chai/register-should';
import King from '../../../src/engine/pieces/king';
import Pawn from '../../../src/engine/pieces/pawn';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Rook from "../../../src/engine/pieces/rook";

describe('King', () => {

    let board;
    beforeEach(() => board = new Board());

    it('can move to adjacent squares', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [
            Square.at(2, 3), Square.at(2, 4), Square.at(2, 5), Square.at(3, 5),
            Square.at(4, 5), Square.at(4, 4), Square.at(4, 3), Square.at(3, 3)
        ];

        moves.should.deep.include.members(expectedMoves);
    });

    it('cannot make any other moves', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(8);
    });

    it('cannot leave the board', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(0, 0), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [Square.at(0, 1), Square.at(1, 1), Square.at(1, 0)];

        moves.should.deep.have.members(expectedMoves);
    });

    it('can take opposing pieces', () => {
        const king = new King(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(5, 5));
    });

    it('cannot take the opposing king', () => {
        const king = new King(Player.WHITE);
        const opposingKing = new King(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingKing);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('cannot take friendly pieces', () => {
        const king = new King(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), friendlyPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    describe("castling", () => {
        it("white king can castle king-side", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 7), rook);

            const moves = king.getAvailableMoves(board);

            moves.should.deep.include(Square.at(0, 6));
        });

        it("white king can castle queen-side", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 0), rook);

            const moves = king.getAvailableMoves(board);

            moves.should.deep.include(Square.at(0, 2));
        });

        it("black king can castle king-side", () => {
            const king = new King(Player.BLACK);
            const rook = new Rook(Player.BLACK);
            board.currentPlayer = Player.BLACK;
            board.setPiece(Square.at(7, 4), king);
            board.setPiece(Square.at(7, 7), rook);

            const moves = king.getAvailableMoves(board);

            moves.should.deep.include(Square.at(7, 6));
        });

        it("black king can castle queen-side", () => {
            const king = new King(Player.BLACK);
            const rook = new Rook(Player.BLACK);
            board.currentPlayer = Player.BLACK;
            board.setPiece(Square.at(7, 4), king);
            board.setPiece(Square.at(7, 0), rook);

            const moves = king.getAvailableMoves(board);

            moves.should.deep.include(Square.at(7, 2));
        });

        it("king cannot castle if it has moved", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 3), king);
            board.setPiece(Square.at(0, 7), rook);

            king.moveTo(board, Square.at(0, 4));

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(0, 6));
        });

        it("king cannot castle if a rook has moved", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 6), rook);

            rook.moveTo(board, Square.at(0, 7));

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(0, 6));
        });

        it("king cannot castle through a friendly piece", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 7), rook);
            board.setPiece(Square.at(0, 5), pawn);

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(0, 6));
        });

        it("king cannot castle through an enemy piece", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 7), rook);
            board.setPiece(Square.at(0, 5), pawn);

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(0, 6));
        });

        it("king cannot castle onto a friendly piece", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 7), rook);
            board.setPiece(Square.at(0, 6), pawn);

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(0, 6));
        });

        it("king cannot castle onto an enemy piece", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 7), rook);
            board.setPiece(Square.at(0, 5), pawn);

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(0, 6));
        });

        it("after castling king-side, rook also moves", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 7), rook);

            king.moveTo(board, Square.at(0, 6));

            should.exist(board.getPiece(Square.at(0, 5)));
            board.getPiece(Square.at(0, 5)).constructor.name.should.equal("Rook");
            should.not.exist(board.getPiece(Square.at(0, 7)));
        });

        it("after castling queen-side, rook also moves", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.WHITE);
            board.setPiece(Square.at(0, 4), king);
            board.setPiece(Square.at(0, 0), rook);

            king.moveTo(board, Square.at(0, 2));

            should.exist(board.getPiece(Square.at(0, 3)));
            board.getPiece(Square.at(0, 3)).constructor.name.should.equal("Rook");
            should.not.exist(board.getPiece(Square.at(0, 0)));
        });
    });

    describe("checks", () => {
        it("cannot move into check", () => {
            const king = new King(Player.WHITE);
            const pawn = new Pawn(Player.BLACK);

            board.setPiece(Square.at(1, 1), king);
            board.setPiece(Square.at(2, 3), pawn);

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(1, 2));
        });

        it("cannot move irrelevant piece when in check", () => {
            const king = new King(Player.WHITE);
            const pawnW = new Pawn(Player.WHITE);
            const pawnB = new Pawn(Player.BLACK);

            board.setPiece(Square.at(1, 1), king);
            board.setPiece(Square.at(2, 2), pawnB);
            board.setPiece(Square.at(1, 0), pawnW);

            const moves = pawnB.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it("can escape check by blocking", () => {
            const king = new King(Player.WHITE);
            const rookW = new Rook(Player.WHITE);
            const rookB = new Rook(Player.BLACK);

            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(7, 1), rookW);
            board.setPiece(Square.at(0, 7), rookB);

            const moves = rookW.getAvailableMoves(board);

            moves.should.deep.include(Square.at(0, 1));
            moves.should.have.length(1);
        });

        it("cannot take protected pieces", () => {
            const king = new King(Player.WHITE);
            const rook1 = new Rook(Player.BLACK);
            const rook2 = new Rook(Player.BLACK);

            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(0, 1), rook1);
            board.setPiece(Square.at(7, 1), rook2);

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(0, 1));
        });

        it("can deal with discovered check", () => {
            const king = new King(Player.WHITE);
            const rook = new Rook(Player.BLACK);
            const pawn = new Pawn(Player.BLACK);

            board.currentPlayer = Player.BLACK;
            board.setPiece(Square.at(1, 0), king);
            board.setPiece(Square.at(1, 4), pawn);
            board.setPiece(Square.at(1, 7), rook);

            pawn.moveTo(board, Square.at(0, 4));

            const moves = king.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(1, 1));
        });

        it("will not move out of a pin illegally", () => {
            const king = new King(Player.WHITE);
            const rookW = new Rook(Player.WHITE);
            const rookB = new Rook(Player.BLACK);

            board.setPiece(Square.at(0, 0), king);
            board.setPiece(Square.at(0, 1), rookW);
            board.setPiece(Square.at(0, 2), rookB);

            const moves = rookW.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(1, 1));
        });
    });
});
