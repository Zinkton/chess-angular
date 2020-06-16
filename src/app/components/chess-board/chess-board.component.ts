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
        console.log(changes.board);
    }

    onDragover(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    onDrop(event, square: string) {
        event.preventDefault();

        let pieceId = event.dataTransfer.getData("piece");
        let sourceSquare = event.dataTransfer.getData("sourceSquare");
        
        if (sourceSquare == square) {
            return;
        }
        
        console.log(`Piece: ${pieceId} moved from ${sourceSquare} to ${square}`); 
        // Check if move is legal?
        event.target.appendChild(document.getElementById(pieceId));
        event.target.classList.add('active-grid-item');
        if (sourceSquare != "") {
            document.getElementById(sourceSquare).classList.remove('active-grid-item');
        }
    }

    onDragStart(event) {
        event.dataTransfer.setData("piece", event.target.id);
        event.dataTransfer.setData("sourceSquare", event.target.parentElement.id);
    }

    onMouseDown(event, square) {
        console.log('mouseDown', square, event);
        this.leftMouseDown = true;
        if (this.isEditMode) {
            this.placePiece(event);
        }
    }

    onMouseUp(event) {
        console.log('mouseUp', event);
        this.leftMouseDown = false;
    }

    onMouseEnter(event) {
        if (this.isEditMode && this.leftMouseDown) {
            this.placePiece(event);
        }
    }

    placePiece(square) {
        this.piecePlaced.next(square);
    }

    removePiece(square) {
        this.pieceRemoved.next(square);
    }
}