import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MoveRequest } from '../models/move-request.model';
import { Constants } from '../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class AiService {
    httpOptions = {
        headers: new HttpHeaders({ 
          'Access-Control-Allow-Origin':'*',
          'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    getMove(gameState: GameState) {
        let endpoint = gameState.isWhiteToMove ? gameState.gameSettings.whitePlayerAiEndpoint : gameState.gameSettings.blackPlayerAiEndpoint;

        let moveRequest = new MoveRequest();
        moveRequest.boardFen = this.getBoardFen(gameState);
        moveRequest.incrementSeconds = gameState.gameSettings.incrementSeconds;
        moveRequest.isRealTime = gameState.gameSettings.isRealTime;
        moveRequest.remainingSeconds = gameState.isWhiteToMove ? gameState.whitePlayerRemainingSeconds : gameState.blackPlayerRemainingSeconds;
        moveRequest.isCasual = gameState.gameSettings.isCasual;
        moveRequest.depth = gameState.gameSettings.depth;

        if (endpoint) {
            return this.http.post(endpoint, moveRequest, this.httpOptions).toPromise();
        }

        return null;
    }

    getBoardFen(gameState: GameState): string {
        let result = new Array<string>();
        let rows = new Array<string>();

        for (let i = 0; i < 8; i++) {
            let row = '';
            let emptyCount = 0;

            for (let j = 0; j < 8; j++) {
                let square = gameState.board[i * 8 + j];
                if (square) {
                    if (emptyCount > 0) {
                        row += emptyCount;
                        emptyCount = 0;
                    }
                    row += square[0] == 'w' ? square[1] : square[1].toLowerCase();
                } else {
                    emptyCount++;
                }
            }

            if (emptyCount > 0) {
                row += emptyCount;
            }

            rows.push(row);
        }

        result.push(rows.join('/'));
        result.push(gameState.isWhiteToMove ? 'w' : 'b');
        
        let castling = '';
        if (gameState.isWhiteKingCastleAllowed) {
            castling += 'K';
        }
        if (gameState.isWhiteQueenCastleAllowed) {
            castling += 'Q';
        }
        if (gameState.isBlackKingCastleAllowed) {
            castling += 'k';
        }
        if (gameState.isBlackQueenCastleAllowed) {
            castling += 'q';
        }
        if (castling == '') {
            castling = '-';
        }

        result.push(castling);

        let targetSquare = '-';
        if (gameState.turnHistory.length > 0) {
            let lastMove = gameState.turnHistory[gameState.turnHistory.length - 1];
            let lastSource = Constants.Squares.indexOf(lastMove.slice(2, 4));
            let lastDestination = Constants.Squares.indexOf(lastMove.slice(4, 6));
            if (lastMove[1] == 'P' && Math.abs(lastDestination - lastSource) == 16) {
                targetSquare = Constants.Squares[(lastDestination + lastSource) / 2];
            }
        }

        result.push(targetSquare);

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

        result.push(halfMoveCount.toString());

        let fullmoveNumber = 0;
        if (gameState.isWhiteToMove) {
            fullmoveNumber = 1 + Math.ceil(gameState.turnHistory.length / 2);
        } else {
            fullmoveNumber = 1 + Math.floor(gameState.turnHistory.length / 2);
        }

        result.push(fullmoveNumber.toString());

        return result.join(' ');
    }
}