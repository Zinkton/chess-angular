import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { LogicService } from 'src/app/services/logic.service';

@Component({
    selector: 'chess-board',
    templateUrl: './chess-board.component.html',
    styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
    @Input() board: Array<string>;
    @Input() isEditMode: boolean;
    @Input() isBoardFlipped: boolean;
    @Input() legalMoves: Array<string>;
    @Output() piecePlaced = new EventEmitter<string>();
    @Output() pieceRemoved = new EventEmitter<string>();
    @Output() pieceMoved = new EventEmitter<string>();

    squares: Array<string>;
    leftMouseDown: boolean;
    rightMouseDown: boolean;
    boardIndexes: Array<number>;
    clickedSquare: number;
    legalSquares: Array<number>;

    constructor(private logicService: LogicService) {}

    ngOnInit() {
        this.squares = Constants.Squares.slice();
        this.leftMouseDown = false;
        this.rightMouseDown = false;
        this.boardIndexes = Constants.BoardIndexes.slice();
        this.clickedSquare = null;
        this.legalSquares = Array<number>();
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

        if (this.legalMoves.includes(move)) {
            this.pieceMoved.next(move);
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

        if (this.clickedSquare) {
            let move = this.board[this.clickedSquare] + this.squares[this.clickedSquare] + source;
            if (this.legalMoves.includes(move)) {
                this.clickedSquare = null;
                this.pieceMoved.next(move);
                return;
            } 
        }

        this.legalMoves.forEach(legalMove => {
            if (legalMove.startsWith(piece + source)) {
                let legalSquare = legalMove.slice(4);
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
}