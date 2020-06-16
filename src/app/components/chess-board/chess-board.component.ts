import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/constants/constants';

@Component({
    selector: 'chess-board',
    templateUrl: './chess-board.component.html',
    styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit, OnChanges {
    @Input() board: Array<string>;
    @Input() isEditMode: boolean;
    @Output() piecePlaced = new EventEmitter<string>();
    @Output() pieceRemoved = new EventEmitter<string>();

    squares: Array<string>;
    leftMouseDown: boolean;
    rightMouseDown: boolean;

    ngOnInit() {
        this.squares = Constants.Squares;
        this.leftMouseDown = false;
        this.rightMouseDown = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        
    }

    onDragover(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    onDrop(event, square: string) {
        event.preventDefault();

        let piece = event.dataTransfer.getData("piece");
        let sourceSquare = event.dataTransfer.getData("sourceSquare");
        
        if (sourceSquare == square) {
            return;
        }
        
        console.log(`Piece: ${piece} trying to move from ${sourceSquare} to ${square}`);
        // Check if move is legal?
        event.target.appendChild(document.getElementById(piece));
        event.target.classList.add('active-grid-item');
        if (sourceSquare != "") {
            document.getElementById(sourceSquare).classList.remove('active-grid-item');
        }
    }

    onDragStart(event, square, piece) {
        event.dataTransfer.setData("sourceSquare", square);
        event.dataTransfer.setData("piece", piece);
    }

    onMouseDown(event, square) {
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
}