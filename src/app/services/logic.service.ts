import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { Constants } from '../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class LogicService {

    constructor() { }

    getLegalMoves(gameState: GameState): Array<string> {
        if (gameState.isGameOver) {
            return null;
        }

        return this.getLegalNonCheckMoves(gameState);

        // let legalMovesNoCheck = this.getLegalNonCheckMoves(gameState);

        // legalMovesNoCheck.forEach(move => {
            
        // })

        // legalMoves.push('resign');

        // return legalMoves;
    }

    getLegalNonCheckMoves(gameState: GameState) {
        let legalMovesNoCheck = new Array<string>();
        let squares = Constants.Squares.slice();

        gameState.board.forEach((piece, i) => {
            if (gameState.isWhiteToMove && piece && piece.startsWith('w')) {
                // White pawn
                if (piece[1] == 'P') {
                    // Forward
                    if (!gameState.board[i - 8]) {
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
                    if (i >= 48 && i <= 55 && !gameState.board[i - 8] && !gameState.board[i - 16]) {
                        legalMovesNoCheck.push('wP' + squares[i] + squares[i - 16]);
                    }
                    // Attack
                    if (i % 8 != 7 && gameState.board[i - 7] && gameState.board[i - 7].startsWith('b')) {
                        if (i - 7 <= 7) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'Q');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'N');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'R');
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7] + 'B');
                        } else {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7]);
                        }
                    }
                    if (i % 8 != 0 && gameState.board[i - 9] && gameState.board[i - 9].startsWith('b')) {
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
                    if (gameState.turnHistory.length > 0 && i >= 24 && i <= 31) {
                        let lastTurn = gameState.turnHistory[gameState.turnHistory.length - 1];
                        let piece = lastTurn.slice(0, 2);
                        let source = squares.indexOf(lastTurn.slice(2, 4));
                        let destination = squares.indexOf(lastTurn.slice(4, 6));

                        if (piece == 'bP' && i % 8 != 7 && source == i - 15 && destination == i + 1) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 7]);
                        }
                        if (piece == 'bP' && i % 8 != 0 && source == i - 17 && destination == i - 1) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i - 9]);
                        }
                    }
                } else if (piece[1] == 'N') {
                    if (i >= 16 && i % 8 < 7 && (!gameState.board[i - 15] || !gameState.board[i - 15].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 15]);
                    }
                    if (i <= 47 && i % 8 > 0 && (!gameState.board[i + 15] || !gameState.board[i + 15].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 15]);
                    }
                    if (i >= 8 && i % 8 < 6 && (!gameState.board[i - 6] || !gameState.board[i - 6].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 6]);
                    }
                    if (i <= 55 && i % 8 > 1 && (!gameState.board[i + 6] || !gameState.board[i + 6].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 6]);
                    }
                    if (i >= 8 && i % 8 > 1 && (!gameState.board[i - 10] || !gameState.board[i - 10].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 10]);
                    }
                    if (i <= 55 && i % 8 < 6 && (!gameState.board[i + 10] || !gameState.board[i + 10].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 10]);
                    }
                    if (i >= 16 && i % 8 > 0 && (!gameState.board[i - 17] || !gameState.board[i - 17].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i - 17]);
                    }
                    if (i <= 47 && i % 8 < 7 && (!gameState.board[i + 17] || !gameState.board[i + 17].startsWith('w'))) {
                        legalMovesNoCheck.push('wN' + squares[i] + squares[i + 17]);
                    }
                } else if (piece[1] == 'B') {
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wB' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wB' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'R') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (gameState.board[up] && gameState.board[up].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[up]);
                            break;
                        }
                        if (gameState.board[up] && gameState.board[up].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (gameState.board[right] && gameState.board[right].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[right]);
                            break;
                        }
                        if (gameState.board[right] && gameState.board[right].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (gameState.board[down] && gameState.board[down].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[down]);
                            break;
                        }
                        if (gameState.board[down] && gameState.board[down].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (gameState.board[left] && gameState.board[left].startsWith('b')) {
                            legalMovesNoCheck.push('wR' + squares[i] + squares[left]);
                            break;
                        }
                        if (gameState.board[left] && gameState.board[left].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wR' + squares[i] + squares[left]);
                    }
                } else if (piece[1] == 'Q') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (gameState.board[up] && gameState.board[up].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[up]);
                            break;
                        }
                        if (gameState.board[up] && gameState.board[up].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (gameState.board[right] && gameState.board[right].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[right]);
                            break;
                        }
                        if (gameState.board[right] && gameState.board[right].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (gameState.board[down] && gameState.board[down].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[down]);
                            break;
                        }
                        if (gameState.board[down] && gameState.board[down].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (gameState.board[left] && gameState.board[left].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[left]);
                            break;
                        }
                        if (gameState.board[left] && gameState.board[left].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[left]);
                    }
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('b')) {
                            legalMovesNoCheck.push('wQ' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('w')) {
                            break;
                        }
                        legalMovesNoCheck.push('wQ' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'K') {
                    if (i >= 8 && (!gameState.board || !gameState.board[i - 8].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 8]);
                    }
                    if (i % 8 != 7 && (!gameState.board[i + 1] || !gameState.board[i + 1].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 1]);
                    }
                    if (i <= 55 && (!gameState.board[i + 8] || !gameState.board[i + 8].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 8]);
                    }
                    if (i % 8 != 0 && (!gameState.board[i - 1] || !gameState.board[i - 1].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 1]);
                    }
                    if (i % 8 != 7 && i >= 8 && (!gameState.board[i - 7] || !gameState.board[i - 7].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 7]);
                    }
                    if (i % 8 != 0 && i >= 8 && (!gameState.board[i - 9] || !gameState.board[i - 9].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i - 9]);
                    }
                    if (i % 8 != 7 && i <= 55 && (!gameState.board[i + 9] || !gameState.board[i + 9].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 9]);
                    }
                    if (i % 8 != 0 && i <= 55 && (!gameState.board[i + 7] || !gameState.board[i + 7].startsWith('w'))) {
                        legalMovesNoCheck.push('wK' + squares[i] + squares[i + 7]);
                    }
                }
            } else if (!gameState.isWhiteToMove && piece?.startsWith('b')) {
                // Black pawn
                if (piece[1] == 'P') {
                    // Forward
                    if (!gameState.board[i + 8]) {
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
                    if (i >= 8 && i <= 15 && !gameState.board[i + 8] && !gameState.board[i + 16]) {
                        legalMovesNoCheck.push('bP' + squares[i] + squares[i + 16]);
                    }
                    // Attack
                    if (i % 8 != 7 && gameState.board[i + 9] && gameState.board[i + 9].startsWith('b')) {
                        if (i + 9 >= 56) {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'Q');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'N');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'R');
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9] + 'B');
                        } else {
                            legalMovesNoCheck.push('bP' + squares[i] + squares[i + 9]);
                        }
                    }
                    if (i % 8 != 0 && gameState.board[i + 7] && gameState.board[i + 7].startsWith('b')) {
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
                    if (gameState.turnHistory.length > 0 && i >= 32 && i <= 39) {
                        let lastTurn = gameState.turnHistory[gameState.turnHistory.length - 1];
                        let piece = lastTurn.slice(0, 2);
                        let source = squares.indexOf(lastTurn.slice(2, 4));
                        let destination = squares.indexOf(lastTurn.slice(4, 6));

                        if (piece == 'wP' && i % 8 != 7 && source == i + 17 && destination == i + 1) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i + 9]);
                        }
                        if (piece == 'wP' && i % 8 != 0 && source == i + 15 && destination == i - 1) {
                            legalMovesNoCheck.push('wP' + squares[i] + squares[i + 7]);
                        }
                    }
                } else if (piece[1] == 'N') {
                    if (i >= 16 && i % 8 < 7 && (!gameState.board[i - 15] || !gameState.board[i - 15].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 15]);
                    }
                    if (i <= 47 && i % 8 > 0 && (!gameState.board[i + 15] || !gameState.board[i + 15].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 15]);
                    }
                    if (i >= 8 && i % 8 < 6 && (!gameState.board[i - 6] || !gameState.board[i - 6].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 6]);
                    }
                    if (i <= 55 && i % 8 > 1 && (!gameState.board[i + 6] || !gameState.board[i + 6].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 6]);
                    }
                    if (i >= 8 && i % 8 > 1 && (!gameState.board[i - 10] || !gameState.board[i - 10].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 10]);
                    }
                    if (i <= 55 && i % 8 < 6 && (!gameState.board[i + 10] || !gameState.board[i + 10].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 10]);
                    }
                    if (i >= 16 && i % 8 > 0 && (!gameState.board[i - 17] || !gameState.board[i - 17].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i - 17]);
                    }
                    if (i <= 47 && i % 8 < 7 && (!gameState.board[i + 17] || !gameState.board[i + 17].startsWith('b'))) {
                        legalMovesNoCheck.push('bN' + squares[i] + squares[i + 17]);
                    }
                } else if (piece[1] == 'B') {
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bB' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bB' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'R') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (gameState.board[up] && gameState.board[up].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[up]);
                            break;
                        }
                        if (gameState.board[up] && gameState.board[up].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (gameState.board[right] && gameState.board[right].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[right]);
                            break;
                        }
                        if (gameState.board[right] && gameState.board[right].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (gameState.board[down] && gameState.board[down].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[down]);
                            break;
                        }
                        if (gameState.board[down] && gameState.board[down].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (gameState.board[left] && gameState.board[left].startsWith('w')) {
                            legalMovesNoCheck.push('bR' + squares[i] + squares[left]);
                            break;
                        }
                        if (gameState.board[left] && gameState.board[left].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bR' + squares[i] + squares[left]);
                    }
                } else if (piece[1] == 'Q') {
                    let up = i;
                    while (up >= 8) {
                        up -= 8;
                        if (gameState.board[up] && gameState.board[up].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[up]);
                            break;
                        }
                        if (gameState.board[up] && gameState.board[up].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[up]);
                    }
                    let right = i;
                    while (right % 8 != 7) {
                        right++;
                        if (gameState.board[right] && gameState.board[right].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[right]);
                            break;
                        }
                        if (gameState.board[right] && gameState.board[right].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[right]);
                    }
                    let down = i;
                    while (down <= 55) {
                        down += 8;
                        if (gameState.board[down] && gameState.board[down].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[down]);
                            break;
                        }
                        if (gameState.board[down] && gameState.board[down].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[down]);
                    }
                    let left = i;
                    while (left % 8 != 0) {
                        left--;
                        if (gameState.board[left] && gameState.board[left].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[left]);
                            break;
                        }
                        if (gameState.board[left] && gameState.board[left].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[left]);
                    }
                    let upRight = i;
                    while (upRight % 8 != 7 && upRight >= 8) {
                        upRight -= 7;
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[upRight]);
                            break;
                        }
                        if (gameState.board[upRight] && gameState.board[upRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[upRight]);
                    }
                    let upLeft = i;
                    while (upLeft % 8 != 0 && upLeft >= 8) {
                        upLeft -= 9;
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[upLeft]);
                            break;
                        }
                        if (gameState.board[upLeft] && gameState.board[upLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[upLeft]);
                    }
                    let downRight = i;
                    while (downRight % 8 != 7 && downRight <= 55) {
                        downRight += 9;
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[downRight]);
                            break;
                        }
                        if (gameState.board[downRight] && gameState.board[downRight].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[downRight]);
                    }
                    let downLeft = i;
                    while (downLeft % 8 != 0 && downLeft <= 55) {
                        downLeft += 7;
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('w')) {
                            legalMovesNoCheck.push('bQ' + squares[i] + squares[downLeft]);
                            break;
                        }
                        if (gameState.board[downLeft] && gameState.board[downLeft].startsWith('b')) {
                            break;
                        }
                        legalMovesNoCheck.push('bQ' + squares[i] + squares[downLeft]);
                    }
                } else if (piece[1] == 'K') {
                    if (i >= 8 && (!gameState.board[i - 8] || !gameState.board[i - 8].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 8]);
                    }
                    if (i % 8 != 7 && (!gameState.board[i + 1] || !gameState.board[i + 1].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i + 1]);
                    }
                    if (i <= 55 && (!gameState.board[i + 8] || !gameState.board[i + 8].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i + 8]);
                    }
                    if (i % 8 != 0 && (!gameState.board[i - 1] || !gameState.board[i - 1].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 1]);
                    }
                    if (i % 8 != 7 && i >= 8 && (!gameState.board[i - 7] || !gameState.board[i - 7].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 7]);
                    }
                    if (i % 8 != 0 && i >= 8 && (!gameState.board[i - 9] || !gameState.board[i - 9].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i - 9]);
                    }
                    if (i % 8 != 7 && i <= 55 && (!gameState.board[i + 9] || !gameState.board[i + 9].startsWith('b'))) {
                        legalMovesNoCheck.push('bK' + squares[i] + squares[i + 9]);
                    }
                    if (i % 8 != 0 && i <= 55 && (!gameState.board[i + 7] || !gameState.board[i + 7].startsWith('b'))) {
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

        let lastMove = gameState.turnHistory[gameState.turnHistory.length - 1];
        if (lastMove == 'resign' || lastMove.endsWith('#')) {
            return true;
        }

        return false;
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

    }
}