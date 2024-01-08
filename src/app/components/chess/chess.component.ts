import { Component } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';
import { Constants } from 'src/app/constants/constants';
import { saveAs } from 'file-saver';
import { GameSettings } from 'src/app/models/game-settings.model';
import { LogicService } from 'src/app/services/logic.service';
import { AiService } from 'src/app/services/ai.service';
import { MoveResponse } from 'src/app/models/move-response.model';

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
    gameTimer: any;
    white: boolean;
    lastWhite: boolean;
    gameStateStack: Array<string>;

    constructor(
        private logicService: LogicService,
        private aiService: AiService) {}

    ngOnInit() {
        this.gameState = this.initGameState();
        this.isEditMode = false;
        this.selectedEditPiece = null;
        this.white = true;
        this.lastWhite = null;
        this.gameStateStack = null
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
        gameState.isBoardFlipped = false;
        gameState.legalMoves = null;
        gameState.isCheck = false;
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
        this.gameState.isBoardFlipped = !this.gameState.isBoardFlipped;
    }

    onTakeBackClick() {
        this.logicService.reset();
        const last_state = this.gameStateStack.pop()
        this.gameState = JSON.parse(last_state)
    }

    playFromPosition() {
        this.isEditMode = false;
        this.gameState.gameSettings.isRealTime = false;
        this.gameState.isGameOver = false;
        this.gameState.turnHistory = new Array<string>();
        this.gameState.whiteLostMaterialList = new Array<string>();
        this.gameState.blackLostMaterialList = new Array<string>();
        this.logicService.reset();
        this.gameState.legalMoves = this.logicService.getLegalMoves(this.gameState);
        this.aiService.getMove(this.gameState, this.gameState.legalMoves)?.then((response: MoveResponse) => {
            this.onPieceMoved(response.move, true);
        });
    }

    startGame(settings) {
        this.gameState.gameSettings = settings;

        if (settings.blackPlayerAiEndpoint == "" && settings.whitePlayerAiEndpoint == "") {
            settings.isCasual = true;
        }

        if (settings.isCasual) {
            if (this.lastWhite == null) {
                if (Math.random() < 0.5) {
                    this.lastWhite = false;
                } else {
                    this.lastWhite = true;
                }
            }

            if (this.lastWhite) {
                settings.blackPlayerAiEndpoint = "http://localhost:8000/";
                settings.whitePlayerAiEndpoint = "";
                this.gameState.isBoardFlipped = false;
            } else {
                settings.blackPlayerAiEndpoint = "";
                settings.whitePlayerAiEndpoint = "http://localhost:8000/";
                this.gameState.isBoardFlipped = true;
            }

            this.lastWhite = !this.lastWhite;
        }

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

        this.logicService.reset();
        this.gameState.legalMoves = this.logicService.getLegalMoves(this.gameState);
        this.gameState.isCheck = this.logicService.isCheck(this.gameState);
        this.gameStateStack = [JSON.stringify(this.gameState)]
        this.aiService.getMove(this.gameState, this.gameState.legalMoves)?.then((response: MoveResponse) => {
            this.onPieceMoved(response.move, true);
        });

        this.startTimer();
    }

    getChess960Board(): Array<string> {
        // ToDo: Implement
        return Constants.DefaultBoard.slice();
    }

    onPieceMoved(move, isAi) {
        if (isAi) {
            let source = Constants.Squares.indexOf(move.slice(0, 2));
            let destination = Constants.Squares.indexOf(move.slice(2, 4));

            for (let i = 0; i < this.gameState.legalMoves.length; i++) {
                let legalMove = this.gameState.legalMoves[i];

                if (move.length == 4 && move == legalMove.slice(2, 6)) {
                    move = legalMove;
                    break;
                }

                if (move.length == 5 && legalMove.length == 7 && move == legalMove.slice(2, 7).toLowerCase()) {
                    move = legalMove;
                    break;
                }

                if (legalMove.endsWith('OO') && 
                    legalMove.slice(2, 4) == move.slice(0, 2) &&
                    legalMove[1] == 'K' &&
                    Math.abs(destination - source) == 2
                ) {
                    if ((destination - source == 2 && !legalMove.endsWith('OOO')) ||
                        (destination - source == -2 && legalMove.endsWith('OOO'))
                    ) {
                        move = legalMove;
                        break;
                    }
                }
            }
        } else {
            this.gameStateStack.push(JSON.stringify(this.gameState))
        }

        this.logicService.makeMove(this.gameState, move);
        this.gameState.legalMoves = this.logicService.getLegalMoves(this.gameState);
        this.gameState.isCheck = this.logicService.isCheck(this.gameState);
        if (this.gameState.isGameOver) {
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
            }
        } else if (this.gameState.legalMoves?.length > 1) {
            this.aiService.getMove(this.gameState, this.gameState.legalMoves)?.then((response: MoveResponse) => {
                this.onPieceMoved(response.move, true);
            });
            this.startTimer();
        }
    }

    startTimer() {
        if (!this.gameState.gameSettings.isRealTime) {
            return;
        }

        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }

        this.gameTimer = setInterval(() => {
            if (this.logicService.substractSecond(this.gameState)) {
                clearInterval(this.gameTimer);
            }
        }, 1000);
    }
}