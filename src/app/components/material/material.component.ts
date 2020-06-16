import { Component, Input } from '@angular/core';

@Component({
  selector: 'material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent {
  @Input() materialList: Array<string>;
}