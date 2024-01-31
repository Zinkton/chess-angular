import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'chess-board',
    templateUrl: './chess-board.component.html',
    styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit, OnChanges {
    @Input() board: Array<string>;
    @Input() isEditMode: boolean;
    @Input() isBoardFlipped: boolean;
    @Input() legalMoves: Array<string>;
    @Input() turnHistory: Array<string>;
    @Input() isCheck: boolean;
    @Input() isWhiteMove: boolean;
    @Input() isGameOver: boolean;
    @Output() piecePlaced = new EventEmitter<string>();
    @Output() pieceRemoved = new EventEmitter<string>();
    @Output() pieceMoved = new EventEmitter<string>();

    squares: Array<string>;
    leftMouseDown: boolean;
    rightMouseDown: boolean;
    boardIndexes: Array<number>;
    clickedSquare: number;
    legalSquares: Array<number>;
    modalRef: any;
    isShowPromotion: boolean;
    pawnMoveForPromote: string;
    lastMoveSquares: Array<number>;
    checkedSquare: number;

    constructor(private modalService: NgbModal) {}

    ngOnInit() {
        this.squares = Constants.Squares.slice();
        this.leftMouseDown = false;
        this.rightMouseDown = false;
        this.boardIndexes = Constants.BoardIndexes.slice();
        this.clickedSquare = null;
        this.legalSquares = Array<number>();
        this.isShowPromotion = false;
        this.pawnMoveForPromote = null;
        this.lastMoveSquares = new Array<number>();
        this.checkedSquare = null;
    }

    ngOnChanges() {
        if (!this.turnHistory || this.turnHistory.length == 0) {
            this.lastMoveSquares = new Array<number>();
            return;
        }

        let move = this.turnHistory[this.turnHistory.length - 1];

        let lastSource = this.squares.indexOf(move.slice(2, 4));
        let lastDestination = this.squares.indexOf(move.slice(4, 6));
        this.lastMoveSquares = [lastSource, lastDestination];

        if (this.isCheck) {
            let king = this.isWhiteMove ? 'wK' : 'bK';
            this.checkedSquare = this.board.indexOf(king);
        } else {
            this.checkedSquare = null;
        }
    }

    onDragover(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    onDrop(event, destination: string) {
        event.preventDefault();

        let piece = event.dataTransfer.getData("piece");
        let source = event.dataTransfer.getData("sourceSquare");
        let move = piece + source + destination;

        if (source != destination) {
            this.legalSquares = new Array<number>();
            this.clickedSquare = null;
        }

        if (this.legalMoves?.includes(move)) {
            this.makeMove(move);
        } else if (this.legalMoves?.includes(move + 'ep')) {
            this.makeMove(move + 'ep');
        } else if (this.legalMoves?.includes(move + 'OO')) {
            this.makeMove(move + 'OO');
        } else if (this.legalMoves?.includes(move + 'OOO')) {
            this.makeMove(move + 'OOO');
        } else if (this.legalMoves?.includes(move + 'Q')) {
            this.openModal(move);
        }
    }

    onDragStart(event, square, piece) {
        event.dataTransfer.setData("sourceSquare", square);
        event.dataTransfer.setData("piece", piece);
    }

    onMouseDown(event, square, piece) {
        if (event.which == 1) {
            this.leftMouseDown = true;
            this.rightMouseDown = false;
        } else if (event.which == 3) {
            this.rightMouseDown = true;
            this.leftMouseDown = false;
        }
        
        if (this.isEditMode) {
            if (this.leftMouseDown) {
                this.placePiece(square);
            } else if (this.rightMouseDown) {
                this.removePiece(square);
            }
        } else {
            if (this.leftMouseDown) {
                this.onSquareClick(piece, square);
            } else if (this.rightMouseDown) {
                this.clickedSquare = null;
                this.legalSquares = new Array<number>();
            }
        }
    }

    onMouseUp(event) {
        if (event.which == 1) {
            this.leftMouseDown = false;
        } else if (event.which == 3) {
            this.rightMouseDown = false;
        }
    }

    onMouseEnter(square) {
        if (this.isEditMode) {
            if (this.leftMouseDown) {
                this.placePiece(square);
            } else if (this.rightMouseDown) {
                this.removePiece(square);
            }
        }
    }

    placePiece(square) {
        this.piecePlaced.next(square);
    }

    removePiece(square) {
        this.pieceRemoved.next(square);
    }

    preventContextMenu(event) {
        event.preventDefault();
    }

    onSquareClick(piece, source) {
        this.legalSquares = new Array<number>();

        if (this.clickedSquare != null) {
            let move = this.board[this.clickedSquare] + this.squares[this.clickedSquare] + source;
            if (this.legalMoves?.includes(move)) {
                this.clickedSquare = null;
                this.makeMove(move);
                return;
            } else if (this.legalMoves?.includes(move + "ep")){
                this.clickedSquare = null;
                this.makeMove(move + "ep");
            } else if (this.legalMoves?.includes(move + 'Q')) {
                this.openModal(move);
                return;
            } else if (this.legalMoves?.includes(move + 'OO')) {
                this.clickedSquare = null;
                this.makeMove(move + 'OO');
                return;
            } else if (this.legalMoves?.includes(move + 'OOO')) {
                this.clickedSquare = null;
                this.makeMove(move + 'OOO');
                return;
            }
        }

        this.legalMoves?.forEach(legalMove => {
            if (legalMove.startsWith(piece + source)) {
                let legalSquare = legalMove.slice(4, 6);
                let legalSquareIndex = this.squares.indexOf(legalSquare);
                this.legalSquares.push(legalSquareIndex);
            }
        });

        if (this.legalSquares.length > 0) {
            this.clickedSquare = this.squares.indexOf(source);
        } else {
            this.clickedSquare = null;
        }
    }

    openModal(move) {
        this.pawnMoveForPromote = move;
        this.isShowPromotion = true;
    }

    promotePawn(piece) {
        this.clickedSquare = null;
        this.makeMove(this.pawnMoveForPromote + piece);
        this.pawnMoveForPromote = null;
        this.isShowPromotion = false;
    }

    makeMove(move) {
        this.pieceMoved.next(move);
    }
}