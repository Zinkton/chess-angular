import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';

@Component({
    selector: 'edit-board',
    templateUrl: './edit-board.component.html',
    styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {
    @Input() gameState: GameState;
    @Output() clearBoard = new EventEmitter();
    @Output() isWhiteKingCastleAllowedToggled = new EventEmitter<boolean>();
    @Output() isWhiteQueenCastleAllowedToggled = new EventEmitter<boolean>();
    @Output() isBlackKingCastleAllowedToggled = new EventEmitter<boolean>();
    @Output() isBlackQueenCastleAllowedToggled = new EventEmitter<boolean>();
    @Output() isWhiteToMoveChanged = new EventEmitter<boolean>();
    @Output() selectedEditPieceChanged = new EventEmitter<string>();

    pieces: Array<string>;
    isWhiteKingCastleAllowed: boolean;
    isWhiteQueenCastleAllowed: boolean;
    isBlackKingCastleAllowed: boolean;
    isBlackQueenCastleAllowed: boolean;
    isWhiteToMove: boolean;
    selectedPiece: string;

    ngOnInit() {
        this.pieces = [
            'wK', 'wQ', 'wR', 'wB', 'wN', 'wP',
            'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];

        this.isWhiteKingCastleAllowed = this.gameState.isWhiteKingCastleAllowed;
        this.isWhiteQueenCastleAllowed = this.gameState.isWhiteQueenCastleAllowed;
        this.isBlackKingCastleAllowed = this.gameState.isBlackKingCastleAllowed;
        this.isBlackQueenCastleAllowed = this.gameState.isBlackQueenCastleAllowed;
        this.isWhiteToMove = this.gameState.isWhiteToMove;
        this.selectPiece('wK');
    }

    onWhiteKingCastleChange() {
        this.isWhiteKingCastleAllowed = !this.isWhiteKingCastleAllowed;
        this.isWhiteKingCastleAllowedToggled.next(this.isWhiteKingCastleAllowed);
    }

    onWhiteQueenCastleChange() {
        this.isWhiteQueenCastleAllowed = !this.isWhiteQueenCastleAllowed;
        this.isWhiteQueenCastleAllowedToggled.next(this.isWhiteQueenCastleAllowed);
    }

    onBlackKingCastleChange() {
        this.isBlackKingCastleAllowed = !this.isBlackKingCastleAllowed;
        this.isBlackKingCastleAllowedToggled.next(this.isBlackKingCastleAllowed);
    }

    onBlackQueenCastleChange() {
        this.isBlackQueenCastleAllowed = !this.isBlackQueenCastleAllowed;
        this.isBlackQueenCastleAllowedToggled.next(this.isBlackQueenCastleAllowed);
    }

    onWhiteToMoveChanged(event) {
        this.isWhiteToMove = event;
        this.isWhiteToMoveChanged.next(this.isWhiteToMove);
    }

    selectPiece(event) {
        if (this.selectedPiece == event) {
            this.selectedPiece = null;
        } else {
            this.selectedPiece = event;
        }

        this.selectedEditPieceChanged.next(this.selectedPiece);
    }

    onClearBoardClick() {
        this.clearBoard.next();
    }
}