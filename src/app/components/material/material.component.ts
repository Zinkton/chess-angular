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
    let side = this.isWhite ? 'w' : 'b'
    this.p = side + 'P';
    this.n = side + 'N';
    this.b = side + 'B';
    this.r = side + 'R';
    this.q = side + 'Q';
  }

  reset() {
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
    
    this.materialList?.forEach(material => {
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

    this.enemyMaterialList?.forEach(material => {
      if (material[1] == 'P') {
        this.enemyScore += 1;
      } else if (material[1] == 'N') {
        this.enemyScore += 3;
      } else if (material[1] == 'B') {
        this.enemyScore += 3;
      } else if (material[1] == 'R') {
        this.enemyScore += 5;
      } else if (material[1] == 'Q') {
        this.enemyScore += 9;
      }
    });

    this.score = this.pawnCount + this.knightCount * 3 + this.bishopCount * 3 + this.rookCount * 5 + this.queenCount * 9 - this.enemyScore;    
  }
}