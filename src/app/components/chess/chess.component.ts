import { Component } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';
import { Constants } from 'src/app/constants/constants';
import { saveAs } from 'file-saver';

@Component({
    selector: 'chess',
    templateUrl: './chess.component.html',
    styleUrls: ['./chess.component.css']
})
export class ChessComponent {
    gameState: GameState;
    whitePlayerName: string;
    blackPlayerName: string;
    isEditMode: boolean;
    selectedEditPiece: string;
    importContent: string;

    constructor() {
    }

    ngOnInit() {
        this.gameState = this.initGameState();
        this.whitePlayerName = "Player 1";
        this.blackPlayerName = "Player 2";
        this.isEditMode = false;
        this.selectedEditPiece = null;
    }

    toggleEdit() {
        this.isEditMode = !this.isEditMode;
    }

    clearBoard() {
        this.gameState.board = Constants.ClearBoard;
    }

    initGameState(): GameState {
        let gameState = new GameState();
        gameState.isWhiteKingCastleAllowed = true;
        gameState.isWhiteQueenCastleAllowed = true;
        gameState.isBlackKingCastleAllowed = true;
        gameState.isBlackQueenCastleAllowed = true;
        gameState.isWhiteToMove = true;
        gameState.isGameOver = true;
        gameState.board = Constants.ClearBoard;

        return gameState;
    }

    setWhiteKingCastleAllowed(event) {
        this.gameState.isWhiteKingCastleAllowed = event;
    }

    setWhiteQueenCastleAllowed(event) {
        this.gameState.isWhiteQueenCastleAllowed = event;
    }

    setBlackKingCastleAllowed(event) {
        this.gameState.isBlackKingCastleAllowed = event;
    }

    setBlackQueenCastleAllowed(event) {
        this.gameState.isBlackQueenCastleAllowed = event;
    }

    setIsWhiteToMove(event) {
        this.gameState.isWhiteToMove = event;
    }

    setSelectedEditPiece(event) {
        this.selectedEditPiece = event;
    }

    onPiecePlaced(event) {
        this.gameState.board[Constants.Squares.indexOf(event)] = this.selectedEditPiece;
        this.gameState.board = this.gameState.board.slice();
    }

    onPieceRemoved(event) {
        this.gameState.board[Constants.Squares.indexOf(event)] = null;
        this.gameState.board = this.gameState.board.slice();
    }

    onExportClick() {
        const blob = new Blob([JSON.stringify(this.gameState)], { type: 'application/json' });
        saveAs(blob, "GameState.json");
    }

    onImportClick() {
        try {
            let gameState = JSON.parse(this.importContent);
            console.log(gameState);
        } catch (error) {
            console.warn('Failed to import', error);
        }
    }

    onImportContentChange(event) {
        this.importContent = event.target.value;
    }
}