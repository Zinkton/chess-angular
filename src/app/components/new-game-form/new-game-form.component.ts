import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameSettings } from 'src/app/models/game-settings.model';

@Component({
  selector: 'new-game-form',
  templateUrl: './new-game-form.component.html',
  styleUrls: ['./new-game-form.component.css']
})
export class NewGameFormComponent implements OnInit {
  @Output() startGame = new EventEmitter<GameSettings>();

  gameSettings: GameSettings;
  isAdvanced: boolean;
  
  ngOnInit() {
    this.gameSettings = this.initSettings();
    this.isAdvanced = false;
  }

  initSettings(): GameSettings {
    let gameSettings = new GameSettings();

    gameSettings.startingPosition = "Standard";
    gameSettings.isRealTime = false;
    gameSettings.minutesPerSide = 5;
    gameSettings.incrementSeconds = 5;
    gameSettings.whitePlayerName = "Player 1";
    gameSettings.whitePlayerAiEndpoint = "";
    gameSettings.blackPlayerName = "Player 2";
    gameSettings.blackPlayerAiEndpoint = "";
    gameSettings.isCasual = false;
    gameSettings.depth = 0;

    return gameSettings;
  }

  onStartingPositionChange(event) {
    this.gameSettings.startingPosition = event.target.value;
  }

  onTimeControlChange(event) {
    this.gameSettings.isRealTime = event.target.value == "Real time";
  }

  onMinutesPerSideChange(event) {
    this.gameSettings.minutesPerSide = parseInt(event.target.value);
  }

  onIncrementSecondsChange(event) {
    this.gameSettings.incrementSeconds = parseInt(event.target.value);
  }

  onWhitePlayerNameChange(event) {
    this.gameSettings.whitePlayerName = event.target.value;
  }

  onWhitePlayerAiEndpointChange(event) {
    this.gameSettings.whitePlayerAiEndpoint = event.target.value;
  }

  onBlackPlayerNameChange(event) {
    this.gameSettings.blackPlayerName = event.target.value;
  }

  onBlackPlayerAiEndpointChange(event) {
    this.gameSettings.blackPlayerAiEndpoint = event.target.value;
  }

  onStartGameClick() {
    this.startGame.next(this.gameSettings);
  }

  onAdvancedClick() {
    this.isAdvanced = true;
  }

  onDifficultyClick(depth) {
    this.gameSettings.depth = depth;
    this.startGame.next(this.gameSettings);
  }
}