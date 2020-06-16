import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnChanges {
  @Input() totalSeconds: number;

  minutes: string;
  seconds: string;

  ngOnChanges(changes: SimpleChanges) {
    this.updateTime();
  }

  updateTime() {
    if (this.totalSeconds == null) {
      this.minutes = "00";
      this.seconds = "00";
    } else {
      let minutes = (this.totalSeconds - this.totalSeconds % 60) / 60;
      let seconds = this.totalSeconds - minutes * 60;
      this.minutes = minutes.toString();
      this.seconds = seconds.toString();
      if (this.minutes.length == 1) {
        this.minutes = "0" + this.minutes;
      }
      if (this.seconds.length == 1) {
        this.seconds = "0" + this.seconds;
      }
    }
  }
}