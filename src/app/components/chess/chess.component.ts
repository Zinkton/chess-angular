import { Component } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';
import { Constants } from 'src/app/constants/constants';
import { saveAs } from 'file-saver';
import { GameSettings } from 'src/app/models/game-settings.model';

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
    isBoardFlipped: boolean;

    constructor() {
    }

    ngOnInit() {
        this.gameState = this.initGameState();
        this.isEditMode = false;
        this.selectedEditPiece = null;
        this.isBoardFlipped = false;
    }

    toggleEdit() {
        this.isEditMode = !this.isEditMode;
    }

    clearBoard() {
        this.gameState.board = Constants.ClearBoard.slice();
    }

    initGameState(): GameState {
        let gameState = new GameState();

        gameState.isWhiteKingCastleAllowed = true;
        gameState.isWhiteQueenCastleAllowed = true;
        gameState.isBlackKingCastleAllowed = true;
        gameState.isBlackQueenCastleAllowed = true;
        gameState.isWhiteToMove = true;
        gameState.isGameOver = true;
        gameState.board = Constants.ClearBoard.slice();
        gameState.gameSettings = this.initGameSettings();

        return gameState;
    }

    initGameSettings(): GameSettings {
        let gameSettings = new GameSettings();

        gameSettings.startingPosition = "Standard";
        gameSettings.isRealTime = true;
        gameSettings.minutesPerSide = 5;
        gameSettings.incrementSeconds = 5;
        gameSettings.whitePlayerName = "Player 1";
        gameSettings.whitePlayerAiEndpoint = "";
        gameSettings.blackPlayerName = "Player 2";
        gameSettings.blackPlayerAiEndpoint = "";

        return gameSettings;
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
            this.gameState.board = gameState.board;
        } catch (error) {
            console.warn('Failed to import', error);
        }
    }

    onImportContentChange(event) {
        this.importContent = event.target.value;
    }

    onFlipBoardClick() {
        this.isBoardFlipped = !this.isBoardFlipped;
    }

    startGame(settings) {
        this.gameState.gameSettings = settings;
        this.gameState.turnHistory = new Array<string>();
        this.gameState.isBlackKingCastleAllowed = true;
        this.gameState.isBlackQueenCastleAllowed = true;
        this.gameState.isWhiteKingCastleAllowed = true;
        this.gameState.isWhiteQueenCastleAllowed = true;
        this.gameState.blackLostMaterialList = new Array<string>();
        this.gameState.whiteLostMaterialList = new Array<string>();
        this.gameState.isGameOver = false;
        this.gameState.isWhiteToMove = true;
        this.gameState.whitePlayerRemainingSeconds = settings.minutesPerSide * 60;
        this.gameState.blackPlayerRemainingSeconds = settings.minutesPerSide * 60;

        if (settings.startingPosition == "Standard") {
            this.gameState.board = Constants.DefaultBoard.slice();
        } else if (settings.startingPosition == "Chess960") {
            this.gameState.board = this.getChess960Board();
        }

        this.gameLoop();
    }

    getChess960Board(): Array<string> {
        // ToDo: Implement
        return Constants.DefaultBoard.slice();
    }

    gameLoop() {
        
    }
}