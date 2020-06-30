import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { Constants } from '../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class LogicService {

    boardHashMap: {[board: string]: number}

    constructor() { }

    getLegalMoves(gameState: GameState): Array<string> {
        if (gameState.isGameOver) {
            return null;
        }

        let squares = Constants.Squares.slice();
        let lastMove = gameState.turnHistory ? gameState.turnHistory[gameState.turnHistory.length - 1] : null;
        let legalMovesNoCheck = this.getLegalNonCheckMoves(gameState.board.slice(), lastMove, gameState.isWhiteToMove);
        let legalMoves = new Array<string>();

        legalMovesNoCheck.forEach(move => {
            let board = this.makeFakeMove(gameState.board.slice(), move);
            let legalEnemyMoves = this.getLegalNonCheckMoves(board, move, !gameState.isWhiteToMove);
            let isMoveLegal = true;
            legalEnemyMoves.forEach(enemyMove => {
                let destination = squares.indexOf(enemyMove.slice(4, 6));
                if (board[destination] && board[destination][1] == 'K') {
                    isMoveLegal = false;
                }
            });
            if (isMoveLegal) {
                legalMoves.push(move);
            }
        });


        let legalEnemyMoves = this.getLegalNonCheckMoves(gameState.board.slice(), null, !gameState.isWhiteToMove);
        if (gameState.isWhiteToMove) {
            if (gameState.isWhiteKingCastleAllowed) {
                let kingPosition = gameState.board.indexOf('wK');
                let right = 1;
                let isPieceInTheWay = false;

                while (gameState.board[kingPosition + right] != 'wR') {
                    if (kingPosition + right >= 64) {
                        gameState.isWhiteKingCastleAllowed = false;
                        break;
                    }

                    if (gameState.board[kingPosition + right]) {
                        isPieceInTheWay = true;
                        break;
                    }

                    right++;

                    if ((kingPosition + right) % 8 == 0) {
                        gameState.isWhiteKingCastleAllowed = false;
                        break;
                    }
                }
                
                if (gameState.isWhiteKingCastleAllowed && !isPieceInTheWay && 
                    kingPosition == 60 && kingPosition + right == 63
                ) {
                    let isPathAttacked = false;
                    for (let i = kingPosition + 1; i < kingPosition + right; i++) {
                        legalEnemyMoves.forEach(enemyMove => {
                            let destination = enemyMove.slice(4, 6);
                            if (destination == squares[i]) {
                                isPathAttacked = true;
                            }
                        });
                    }
                    if (!isPathAttacked) {
                        legalMoves.push('wK' + squares[kingPosition] + squares[kingPosition + right] + 'OO');
                    }
                }
            }
            if (gameState.isWhiteQueenCastleAllowed) {
                let kingPosition = gameState.board.indexOf('wK');
                let left = 1;
                let isPieceInTheWay = false;
                while (gameState.board[kingPosition - left] != 'wR') {
                    if (kingPosition - left < 0) {
                        gameState.isWhiteQueenCastleAllowed = false;
                        break;
                    }

                    if (gameState.board[kingPosition - left]) {
                        isPieceInTheWay = true;
                        break;
                    }

                    left++;

                    if ((kingPosition - left) % 8 == 7 || kingPosition - left < 0) {
                        gameState.isWhiteQueenCastleAllowed = false;
                        break;
                    }
                }
                if (gameState.isWhiteQueenCastleAllowed && !isPieceInTheWay && 
                    kingPosition == 60 && kingPosition - left == 56
                ) {
                    let isPathAttacked = false;
                    for (let i = kingPosition - 1; i > kingPosition - left; i--) {
                        legalEnemyMoves.forEach(enemyMove => {
                            let destination = enemyMove.slice(4, 6);
                            if (destination == squares[i]) {
                                isPathAttacked = true;
                            }
                        });
                    }
                    if (!isPathAttacked) {
                        legalMoves.push('wK' + squares[kingPosition] + squares[kingPosition - left] + 'OOO');
                    }
                }
            }
        } else {
            if (gameState.isBlackKingCastleAllowed) {
                let kingPosition = gameState.board.indexOf('bK');
                let right = 1;
                let isPieceInTheWay = false;
                while (gameState.board[kingPosition + right] != 'bR') {
                    if (kingPosition + right >= 64) {
                        gameState.isBlackKingCastleAllowed = false;
                        break;
                    }

                    if (gameState.board[kingPosition + right]) {
                        isPieceInTheWay = true;
                        break;
                    }

                    right++;

                    if ((kingPosition + right) % 8 == 0) {
                        gameState.isBlackKingCastleAllowed = false;
                        break;
                    }
                }
                if (gameState.isBlackKingCastleAllowed && !isPieceInTheWay && 
                    kingPosition == 4 && kingPosition + right == 7
                ) {
                    let isPathAttacked = false;
                    for (let i = kingPosition + 1; i < kingPosition + right; i++) {
                        legalEnemyMoves.forEach(enemyMove => {
                            let destination = enemyMove.slice(4, 6);
                            if (destination == squares[i]) {
                                isPathAttacked = true;
                            }
                        });
                    }
                    if (!isPathAttacked) {
                        legalMoves.push('bK' + squares[kingPosition] + squares[kingPosition + right] + 'OO');
                    }
                }
            }
            if (gameState.isBlackQueenCastleAllowed) {
                let kingPosition = gameState.board.indexOf('bK');
                let left = 1;
                let isPieceInTheWay = false;
                while (gameState.board[kingPosition - left] != 'bR') {
                    if (kingPosition - left < 0) {
                        gameState.isBlackQueenCastleAllowed = false;
                        break;
                    }

                    if (gameState.board[kingPosition - left]) {
                        isPieceInTheWay = true;
                        break;
                    }

                    left++;

                    if ((kingPosition - left) % 8 == 7 || kingPosition - left < 0) {
                        gameState.isBlackQueenCastleAllowed = false;
                        break;
                    }
                }
                if (gameState.isBlackQueenCastleAllowed && !isPieceInTheWay && 
                    kingPosition == 4 && kingPosition - left == 0
                ) {
                    let isPathAttacked = false;
                    for (let i = kingPosition - 1; i > kingPosition - left; i--) {
                        legalEnemyMoves.forEach(enemyMove => {
                            let destination = enemyMove.slice(4, 6);
                            if (destination == squares[i]) {
                                isPathAttacked = true;
                            }
                        });
                    }
                    if (!isPathAttacked) {
                        legalMoves.push('bK' + squares[kingPosition] + squares[kingPosition - left] + 'OOO');
                    }
                }
            }
        }

        legalMoves.push('resign');

        return legalMoves;
    }

    makeFakeMove(board: Array<string>, move: string): Array<string> {
        let squares = Constants.Squares.slice();
        let piece = move.slice(0, 2);
        let source = squares.indexOf(move.slice(2, 4));
        let destination = squares.indexOf(move.slice(4, 6));

        board[source] = null;
        board[destination] = piece;
        if (piece[1] == 'P' && move.length == 7) {
            board[destination] = piece[0] + move[6];
        } else if (piece[1] == 'P' && move.length == 8 && move.slice(6, 8) == 'ep') {
            if (move[0] == 'w') {
                board[destination + 8] = null;
            } else {
                board[destination - 8] = null;
            }
        }

        return board;
    }

    getLegalNonCheckMoves(board: Array<string>, lastMove: string, isWhiteToMove: boolean) {
        let legalMovesNoCheck = new Array<string>();
        let squares = Constants.Squares.slice();

        board.forEach((piece, i) => {
            if (isWhiteToMove && piece && piece.startsWith('w')) {
                // White pawn
                if (piece[1] == 'P') {
                    // Forward
                    if (!board[i - 8]) {
                        if (i - 8 <= 7) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 8] + 'Q');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 8] + 'N');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 8] + 'R');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 8] + 'B');
                        } else {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 8]);
                        }
                    }
                    // Double Forward
                    if (i >= 48 && i <= 55 && !board[i - 8] && !board[i - 16]) {
                        legalMovesNoCheck.push('wP' + squares[i] + squares[i - 16]);
                    }
                    // Attack
                    if (i % 8 != 7 && board[i - 7] && board[i - 7].startsWith('b')) {
                        if (i - 7 <= 7) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'Q');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'N');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'R');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'B');
                        } else {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7]);
                        }
                    }
                    if (i % 8 != 0 && board[i - 9] && board[i - 9].startsWith('b')) {
                        if (i - 9 <= 7) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 9] + 'Q');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 9] + 'N');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 9] + 'R');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 9] + 'B');
                        } else {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 9]);
                        }
                    }
                    // En passant
                    if (lastMove && i >= 24 && i <= 31) {
                        let piece = lastMove.slice(0, 2);
                        let source = squares.indexOf(lastMove.slice(2, 4));
                        let destination = squares.indexOf(lastMove.slice(4, 6));

                        if (piece == 'bP' && i % 8 != 7 && source == i - 15 && destination == i + 1) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'ep');
                        }
                        if (piece == 'bP' && i % 8 != 0 && source == i - 17 && destination == i - 1) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 9] + 'ep');
                        }
                    }
                } else if (piece[1] == 'N') {
                    if (i >= 16 && i % 8 < 7 && (!board[i - 15] || !board[i - 15].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 15]);
                    }
                    if (i <= 47 && i % 8 > 0 && (!board[i + 15] || !board[i + 15].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 15]);
                    }
                    if (i >= 8 && i % 8 < 6 && (!board[i - 6] || !board[i - 6].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 6]);
                    }
                    if (i <= 55 && i % 8 > 1 && (!board[i + 6] || !board[i + 6].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 6]);
                    }
                    if (i >= 8 && i % 8 > 1 && (!board[i - 10] || !board[i - 10].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 10]);
                    }
                    if (i <= 55 && i % 8 < 6 && (!board[i + 10] || !board[i + 10].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 10]);
                    }
                    if (i >= 16 && i % 8 > 0 && (!board[i - 17] || !board[i - 17].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 17]);
                    }
                    if (i <= 47 && i % 8 < 7 && (!board[i + 17] || !board[i + 17].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 17]);
                    }
                } else if (piece[1] == 'B') {
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (board[upRight] && board[upRight].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (board[upRight] && board[upRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (board[upLeft] && board[upLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (board[upLeft] && board[upLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (board[downRight] && board[downRight].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (board[downRight] && board[downRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (board[downLeft] && board[downLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (board[downLeft] && board[downLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'R') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (board[up] && board[up].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[up]);
                            break;
                        }
                        if (board[up] && board[up].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (board[right] && board[right].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[right]);
                            break;
                        }
                        if (board[right] && board[right].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (board[down] && board[down].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[down]);
                            break;
                        }
                        if (board[down] && board[down].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (board[left] && board[left].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[left]);
                            break;
                        }
                        if (board[left] && board[left].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[left]);
                    }
                } else if (piece[1] == 'Q') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (board[up] && board[up].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[up]);
                            break;
                        }
                        if (board[up] && board[up].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (board[right] && board[right].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[right]);
                            break;
                        }
                        if (board[right] && board[right].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (board[down] && board[down].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[down]);
                            break;
                        }
                        if (board[down] && board[down].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (board[left] && board[left].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[left]);
                            break;
                        }
                        if (board[left] && board[left].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[left]);
                    }
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (board[upRight] && board[upRight].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (board[upRight] && board[upRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (board[upLeft] && board[upLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (board[upLeft] && board[upLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (board[downRight] && board[downRight].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (board[downRight] && board[downRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (board[downLeft] && board[downLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (board[downLeft] && board[downLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'K') {
                    if (i >= 8 && (!board[i - 8] || !board[i - 8].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 8]);
                    }
                    if (i % 8 != 7 && (!board[i + 1] || !board[i + 1].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 1]);
                    }
                    if (i <= 55 && (!board[i + 8] || !board[i + 8].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 8]);
                    }
                    if (i % 8 != 0 && (!board[i - 1] || !board[i - 1].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 1]);
                    }
                    if (i % 8 != 7 && i >= 8 && (!board[i - 7] || !board[i - 7].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 7]);
                    }
                    if (i % 8 != 0 && i >= 8 && (!board[i - 9] || !board[i - 9].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 9]);
                    }
                    if (i % 8 != 7 && i <= 55 && (!board[i + 9] || !board[i + 9].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 9]);
                    }
                    if (i % 8 != 0 && i <= 55 && (!board[i + 7] || !board[i + 7].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 7]);
                    }
                }
            } else if (!isWhiteToMove && piece && piece.startsWith('b')) {
                // Black pawn
                if (piece[1] == 'P') {
                    // Forward
                    if (!board[i + 8]) {
                        if (i + 8 >= 56) {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 8] + 'Q');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 8] + 'N');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 8] + 'R');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 8] + 'B');
                        } else {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 8]);
                        }
                    }
                    // Double Forward
                    if (i >= 8 && i <= 15 && !board[i + 8] && !board[i + 16]) {
                        legalMovesNoCheck.push('bP' + squares[i] + squares[i + 16]);
                    }
                    // Attack
                    if (i % 8 != 7 && board[i + 9] && board[i + 9].startsWith('w')) {
                        if (i + 9 >= 56) {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'Q');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'N');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'R');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'B');
                        } else {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9]);
                        }
                    }
                    if (i % 8 != 0 && board[i + 7] && board[i + 7].startsWith('w')) {
                        if (i + 7 >= 56) {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 7] + 'Q');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 7] + 'N');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 7] + 'R');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 7] + 'B');
                        } else {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 7]);
                        }
                    }
                    // En passant
                    if (lastMove && i >= 32 && i <= 39) {
                        let piece = lastMove.slice(0, 2);
                        let source = squares.indexOf(lastMove.slice(2, 4));
                        let destination = squares.indexOf(lastMove.slice(4, 6));

                        if (piece == 'wP' && i % 8 != 7 && source == i + 17 && destination == i + 1) {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'ep');
                        }
                        if (piece == 'wP' && i % 8 != 0 && source == i + 15 && destination == i - 1) {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 7] + 'ep');
                        }
                    }
                } else if (piece[1] == 'N') {
                    if (i >= 16 && i % 8 < 7 && (!board[i - 15] || !board[i - 15].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 15]);
                    }
                    if (i <= 47 && i % 8 > 0 && (!board[i + 15] || !board[i + 15].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 15]);
                    }
                    if (i >= 8 && i % 8 < 6 && (!board[i - 6] || !board[i - 6].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 6]);
                    }
                    if (i <= 55 && i % 8 > 1 && (!board[i + 6] || !board[i + 6].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 6]);
                    }
                    if (i >= 8 && i % 8 > 1 && (!board[i - 10] || !board[i - 10].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 10]);
                    }
                    if (i <= 55 && i % 8 < 6 && (!board[i + 10] || !board[i + 10].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 10]);
                    }
                    if (i >= 16 && i % 8 > 0 && (!board[i - 17] || !board[i - 17].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 17]);
                    }
                    if (i <= 47 && i % 8 < 7 && (!board[i + 17] || !board[i + 17].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 17]);
                    }
                } else if (piece[1] == 'B') {
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (board[upRight] && board[upRight].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (board[upRight] && board[upRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (board[upLeft] && board[upLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (board[upLeft] && board[upLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (board[downRight] && board[downRight].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (board[downRight] && board[downRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (board[downLeft] && board[downLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (board[downLeft] && board[downLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'R') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (board[up] && board[up].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[up]);
                            break;
                        }
                        if (board[up] && board[up].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (board[right] && board[right].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[right]);
                            break;
                        }
                        if (board[right] && board[right].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (board[down] && board[down].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[down]);
                            break;
                        }
                        if (board[down] && board[down].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (board[left] && board[left].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[left]);
                            break;
                        }
                        if (board[left] && board[left].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[left]);
                    }
                } else if (piece[1] == 'Q') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (board[up] && board[up].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[up]);
                            break;
                        }
                        if (board[up] && board[up].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (board[right] && board[right].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[right]);
                            break;
                        }
                        if (board[right] && board[right].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (board[down] && board[down].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[down]);
                            break;
                        }
                        if (board[down] && board[down].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (board[left] && board[left].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[left]);
                            break;
                        }
                        if (board[left] && board[left].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[left]);
                    }
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (board[upRight] && board[upRight].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (board[upRight] && board[upRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (board[upLeft] && board[upLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (board[upLeft] && board[upLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (board[downRight] && board[downRight].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (board[downRight] && board[downRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (board[downLeft] && board[downLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (board[downLeft] && board[downLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'K') {
                    if (i >= 8 && (!board[i - 8] || !board[i - 8].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 8]);
                    }
                    if (i % 8 != 7 && (!board[i + 1] || !board[i + 1].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i + 1]);
                    }
                    if (i <= 55 && (!board[i + 8] || !board[i + 8].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i + 8]);
                    }
                    if (i % 8 != 0 && (!board[i - 1] || !board[i - 1].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 1]);
                    }
                    if (i % 8 != 7 && i >= 8 && (!board[i - 7] || !board[i - 7].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 7]);
                    }
                    if (i % 8 != 0 && i >= 8 && (!board[i - 9] || !board[i - 9].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 9]);
                    }
                    if (i % 8 != 7 && i <= 55 && (!board[i + 9] || !board[i + 9].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i + 9]);
                    }
                    if (i % 8 != 0 && i <= 55 && (!board[i + 7] || !board[i + 7].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i + 7]);
                    }
                }
            }
        });

        return legalMovesNoCheck;
    }

    isGameOver(gameState: GameState): boolean {
        if (gameState.turnHistory.length == 0) {
            return false;
        }

        var isPiecesLeft = false;

        gameState.board.forEach(s => {
            if (s != null && s != 'wK' && s!= 'bK') {
                isPiecesLeft = true;
            }
        })

        if (!isPiecesLeft) {
            gameState.winner = 'd';
            return true;
        }

        let boardString = gameState.board.join(';');
        if (!this.boardHashMap[boardString]) {
            this.boardHashMap[boardString] = 1;
        } else {
            this.boardHashMap[boardString]++;
        }
        if (this.boardHashMap[boardString] >= 3) {
            gameState.winner = "d";
            return true;
        }

        let legalMoves = this.getLegalMoves(gameState);
        if (legalMoves.length == 1) {
            gameState.winner = gameState.isWhiteToMove ? 'b' : 'w';
            return true;
        }

        let lastMove = gameState.turnHistory[gameState.turnHistory.length - 1];
        if (lastMove == 'resign') {
            return true;
        }

        let halfMoveCount = 0;
        if (gameState.turnHistory.length > 0) {
            for (var i = gameState.turnHistory.length - 1; i >= 0; i--) {
                let move = gameState.turnHistory[i];
                if (move[1] == 'P' || move.endsWith('x')) {
                    break;
                }
                halfMoveCount++;
            }
        }

        if (halfMoveCount >= 50) {
            gameState.winner = 'd';
            return true;
        }

        return false;
    }

    reset() {
        this.boardHashMap = { };
    }

    substractSecond(gameState: GameState): boolean {
        if (gameState.isWhiteToMove) {
            gameState.whitePlayerRemainingSeconds--;
            if (gameState.whitePlayerRemainingSeconds == 0) {
                gameState.winner = "b";
                gameState.isGameOver = true;
                return true;
            }
        } else {
            gameState.blackPlayerRemainingSeconds--;
            if (gameState.blackPlayerRemainingSeconds == 0) {
                gameState.winner = "w";
                gameState.isGameOver = true;
                return true;
            }
        }

        return false;
    }

    makeMove(gameState: GameState, move: string) {
        let squares = Constants.Squares.slice();
        let piece = move.slice(0, 2);
        let source = squares.indexOf(move.slice(2, 4));
        let destination = squares.indexOf(move.slice(4, 6));
        let isCapture = false;

        if (piece[1] == 'K' && move.endsWith('OO')) {
            gameState.board[source] = null;
            let rook = gameState.board[destination];
            gameState.board[destination] = null;
            if (piece[0] == 'w' && move.slice(6) == 'OO') {
                gameState.board[62] = piece;
                gameState.board[61] = rook;
                gameState.isWhiteKingCastleAllowed = false;
                gameState.isWhiteQueenCastleAllowed = false;
            }
            if (piece[0] == 'w' && move.slice(6) == 'OOO') {
                gameState.board[58] = piece;
                gameState.board[59] = rook;
                gameState.isWhiteKingCastleAllowed = false;
                gameState.isWhiteQueenCastleAllowed = false;
            }
            if (piece[0] == 'b' && move.slice(6) == 'OO') {
                gameState.board[6] = piece;
                gameState.board[5] = rook;
                gameState.isBlackKingCastleAllowed = false;
                gameState.isBlackQueenCastleAllowed = false;
            }
            if (piece[0] == 'b' && move.slice(6) == 'OOO') {
                gameState.board[2] = piece;
                gameState.board[3] = rook;
                gameState.isBlackKingCastleAllowed = false;
                gameState.isBlackQueenCastleAllowed = false;
            }
        } else {
            if (piece == 'wK') {
                gameState.isWhiteKingCastleAllowed = false;
                gameState.isWhiteQueenCastleAllowed = false;
            }
            if (piece == 'bK') {
                gameState.isBlackKingCastleAllowed = false;
                gameState.isBlackQueenCastleAllowed = false;
            }
            // ToDo: Chess960 checks
            if (gameState.isWhiteKingCastleAllowed) {
                if (piece == 'wR' && source == 63) {
                    gameState.isWhiteKingCastleAllowed = false;
                }
            }
            if (gameState.isWhiteQueenCastleAllowed) {
                if (piece == 'wR' && source == 56) {
                    gameState.isWhiteQueenCastleAllowed = false;
                }
            }
            if (gameState.isBlackKingCastleAllowed) {
                if (piece == 'bR' && source == 7) {
                    gameState.isBlackKingCastleAllowed = false;
                }
            }
            if (gameState.isBlackQueenCastleAllowed) {
                if (piece == 'bR' && source == 0) {
                    gameState.isBlackQueenCastleAllowed = false;
                }
            }

            gameState.board[source] = null;

            if (gameState.board[destination]) {
                isCapture = true;

                if (gameState.board[destination][0] == 'w') {
                    gameState.whiteLostMaterialList.push(gameState.board[destination]);
                    if (destination == 63) {
                        gameState.isWhiteKingCastleAllowed = false;
                    } else if (destination == 56) {
                        gameState.isWhiteQueenCastleAllowed = false;
                    }
                } else {
                    gameState.blackLostMaterialList.push(gameState.board[destination]);
                    if (destination == 7) {
                        gameState.isBlackKingCastleAllowed = false;
                    } else if (destination == 0) {
                        gameState.isBlackQueenCastleAllowed = false;
                    }
                }
            }
            
            gameState.board[destination] = piece;
            if (piece[1] == 'P' && move.length == 7) {
                gameState.board[destination] = piece[0] + move[6];
            } else if (piece[1] == 'P' && move.length == 8 && move.slice(6, 8) == 'ep') {
                isCapture = true;
                if (move[0] == 'w') {
                    gameState.blackLostMaterialList.push(gameState.board[destination + 8]);
                    gameState.board[destination + 8] = null;
                } else {
                    gameState.blackLostMaterialList.push(gameState.board[destination - 8]);
                    gameState.board[destination - 8] = null;
                }
            }
        }

        if (gameState.gameSettings.isRealTime) {
            if (gameState.isWhiteToMove) {
                gameState.whitePlayerRemainingSeconds += gameState.gameSettings.incrementSeconds;
            } else {
                gameState.blackPlayerRemainingSeconds += gameState.gameSettings.incrementSeconds;
            }
        }

        gameState.isWhiteToMove = !gameState.isWhiteToMove;
        if (isCapture) {
            gameState.turnHistory.push(move + 'x');
        } else {
            gameState.turnHistory.push(move);
        }
        
        gameState.turnHistory = gameState.turnHistory.slice();
        gameState.isGameOver = this.isGameOver(gameState);
    }
}