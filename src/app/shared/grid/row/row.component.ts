import { Component, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RowComponent {}

@NgModule({
  declarations: [RowComponent],
  exports: [RowComponent],
})
export class RowModule {}
