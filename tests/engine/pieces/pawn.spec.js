import 'chai/register-should';
import Pawn from '../../../src/engine/pieces/pawn';
import Rook from '../../../src/engine/pieces/rook';
import King from '../../../src/engine/pieces/king';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';

describe('Pawn', () => {

    let board;
    beforeEach(() => board = new Board());

    describe('white pawns', () => {
        
        it('can only move one square up if they have already moved', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 0), pawn);
            pawn.moveTo(board, Square.at(2, 0));

            const moves = pawn.getAvailableMoves(board);
            
            moves.should.have.length(1);
            moves.should.deep.include(Square.at(3, 0));
        });

        it('can move one or two squares up on their first move', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(2, 7), Square.at(3, 7)]);
        });

        it('cannot move at the top of the board', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(7, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(5, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.WHITE);
            const friendlyPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingKing = new King(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        describe("en passant", () => {

            it("can en passant in valid conditions", () => {
                // (B:) double move, check for en passant
                const pawnW = new Pawn(Player.WHITE);
                const pawnB = new Pawn(Player.BLACK);

                board.currentPlayer = Player.BLACK;
                board.setPiece(Square.at(4, 4), pawnW);
                board.setPiece(Square.at(6, 3), pawnB);

                pawnB.moveTo(board, Square.at(4, 3));

                const moves = pawnW.getAvailableMoves(board);

                moves.should.deep.include(Square.at(5, 3));

                pawnW.moveTo(board, Square.at(5, 3));

                should.not.exist(board.getPiece(Square.at(4, 3)));
            });

            it("cannot en passant if not on same move", () => {
                // (B:) non-pawn move but pawn in right position, check for no en passant
                const pawnW = new Pawn(Player.WHITE);
                const pawnB = new Pawn(Player.BLACK);
                const pawnB2 = new Pawn(Player.BLACK);

                board.currentPlayer = Player.BLACK;
                board.setPiece(Square.at(4, 4), pawnW);
                board.setPiece(Square.at(4, 3), pawnB);
                board.setPiece(Square.at(0, 6), pawnB2);

                pawnB2.moveTo(board, Square.at(0, 5));

                const moves = pawnW.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(5, 3));
            });

            it("cannot en passant if come from single move", () => {
                // (B:) single pawn move but pawn in right position, check for no en passant
                const pawnW = new Pawn(Player.WHITE);
                const pawnB = new Pawn(Player.BLACK);

                board.currentPlayer = Player.BLACK;
                board.setPiece(Square.at(4, 4), pawnW);
                board.setPiece(Square.at(5, 3), pawnB);

                pawnB.moveTo(board, Square.at(4, 3));

                const moves = pawnW.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(5, 3));
            });

            it("cannot en passant non-pawn pieces", () => {
                // (B:) rook doing perfect setup, check for no en passant
                const pawnW = new Pawn(Player.WHITE);
                const rookB = new Rook(Player.BLACK);

                board.currentPlayer = Player.BLACK;
                board.setPiece(Square.at(4, 4), pawnW);
                board.setPiece(Square.at(6, 3), rookB);

                rookB.moveTo(board, Square.at(4, 3));

                const moves = pawnW.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(5, 3));
            });
        });
    });

    describe('black pawns', () => {

        let board;
        beforeEach(() => board = new Board(Player.BLACK));    
        
        it('can only move one square down if they have already moved', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 0), pawn);
            pawn.moveTo(board, Square.at(5, 0));

            const moves = pawn.getAvailableMoves(board);
            
            moves.should.have.length(1);
            moves.should.deep.include(Square.at(4, 0));
        });

        it('can move one or two squares down on their first move', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(4, 7), Square.at(5, 7)]);
        });

        it('cannot move at the bottom of the board', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(0, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(3, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.BLACK);
            const friendlyPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingKing = new King(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        describe("en passant", () => {
            it("can en passant in valid conditions", () => {
                // (W:) double move, check for en passant
                const pawnW = new Pawn(Player.WHITE);
                const pawnB = new Pawn(Player.BLACK);

                board.currentPlayer = Player.WHITE;
                board.setPiece(Square.at(1, 3), pawnW);
                board.setPiece(Square.at(3, 2), pawnB);

                pawnW.moveTo(board, Square.at(3, 3));

                const moves = pawnB.getAvailableMoves(board);

                moves.should.deep.include(Square.at(2, 3));

                pawnB.moveTo(board, Square.at(2, 3));

                should.not.exist(board.getPiece(Square.at(3, 3)));
            });

            it("cannot en passant if not on same move", () => {
                // (W:) non-pawn move but pawn in right position, check for no en passant
                const pawnW = new Pawn(Player.WHITE);
                const pawnW2 = new Pawn(Player.WHITE);
                const pawnB = new Pawn(Player.BLACK);

                board.currentPlayer = Player.WHITE;
                board.setPiece(Square.at(3, 3), pawnW);
                board.setPiece(Square.at(3, 2), pawnB);
                board.setPiece(Square.at(0, 1), pawnW2);

                pawnW2.moveTo(board, Square.at(0, 2));

                const moves = pawnB.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(2, 3));
            });

            it("cannot en passant if come from single move", () => {
                // (W:) single pawn move but pawn in right position, check for no en passant
                const pawnW = new Pawn(Player.WHITE);
                const pawnB = new Pawn(Player.BLACK);

                board.currentPlayer = Player.WHITE;
                board.setPiece(Square.at(2, 3), pawnW);
                board.setPiece(Square.at(3, 2), pawnB);

                pawnW.moveTo(board, Square.at(3, 3));

                const moves = pawnW.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(2, 3));
            });

            it("cannot en passant non-pawn pieces", () => {
                // (W:) rook doing perfect setup, check for no en passant
                const rookW = new Rook(Player.WHITE);
                const pawnB = new Pawn(Player.BLACK);

                board.currentPlayer = Player.WHITE;
                board.setPiece(Square.at(1, 3), rookW);
                board.setPiece(Square.at(3, 2), pawnB);

                rookW.moveTo(board, Square.at(3, 3));

                const moves = pawnB.getAvailableMoves(board);

                moves.should.not.deep.include(Square.at(2, 3));
            });
        });
    });

    it('cannot move if there is a piece in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(5, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.be.empty;
    });

    it('cannot move two squares if there is a piece two sqaures in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(4, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 3));
    });

});
