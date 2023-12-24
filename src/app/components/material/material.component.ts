import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit, OnChanges {
  @Input() materialList: Array<string>;
  @Input() enemyMaterialList: Array<string>;
  @Input() isWhite: boolean;
  @Input() isBoardFlipped: boolean;
  @Input() board: Array<string>;

  pawnCount: number;
  knightCount: number;
  bishopCount: number;
  rookCount: number;
  queenCount: number;
  score: number;
  enemyScore: number;
  p: string;
  n: string;
  b: string;
  r: string;
  q: string;

  ngOnInit() {
    this.reset();
  }

  reset() {
    let side = this.isWhite ? 'w' : 'b'
    side = this.isBoardFlipped ? side == 'w' ? 'b' : 'w' : side;
    this.p = side + 'P';
    this.n = side + 'N';
    this.b = side + 'B';
    this.r = side + 'R';
    this.q = side + 'Q';
    this.pawnCount = 0;
    this.knightCount = 0;
    this.bishopCount = 0;
    this.rookCount = 0;
    this.queenCount = 0;
    this.score = 0;
    this.enemyScore = 0;
  }

  ngOnChanges() {
    this.reset();

    if (!this.materialList) {
      return;
    }
    
    let allyMaterial = this.materialList;
    let enemyMaterialList = this.enemyMaterialList;

    if (this.isBoardFlipped) {
      allyMaterial = this.enemyMaterialList;
      enemyMaterialList = this.materialList;
    }
    
    allyMaterial?.forEach(material => {
      if (material[1] == 'P') {
        this.pawnCount++;
      } else if (material[1] == 'N') {
        this.knightCount++;
      } else if (material[1] == 'B') {
        this.bishopCount++;
      } else if (material[1] == 'R') {
        this.rookCount++;
      } else if (material[1] == 'Q') {
        this.queenCount++;
      }
    });

    let whiteScore = 0;
    let blackScore = 0;
    this.board.forEach(square => {
      switch (square) {
        case 'wP':
          whiteScore += 1;
          break;
        case 'wN':
          whiteScore += 3;
          break;
        case 'wB':
          whiteScore += 3;
          break;
        case 'wR':
          whiteScore += 5;
          break;
        case 'wQ':
          whiteScore += 9;
          break;
        case 'bP':
          blackScore += 1;
          break;
        case 'bN':
          blackScore += 3;
          break;
        case 'bB':
          blackScore += 3;
          break;
        case 'bR':
          blackScore += 5;
          break;
        case 'bQ':
          blackScore += 9;
          break;
      }
    });
    let score = this.isWhite ? blackScore - whiteScore : whiteScore - blackScore;
    this.score = this.isBoardFlipped ? -score : score;   
  }
}