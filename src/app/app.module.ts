import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChessComponent } from './components/chess/chess.component';
import { MaterialComponent } from './components/material/material.component';
import { NewGameFormComponent } from './components/new-game-form/new-game-form.component';
import { TimeComponent } from './components/time/time.component';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ChessComponent,
    MaterialComponent,
    NewGameFormComponent,
    TimeComponent,
    ChessBoardComponent,
    EditBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
