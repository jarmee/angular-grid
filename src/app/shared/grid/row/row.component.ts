import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RowComponent {
  @Input()
  editable: boolean;

  @Input()
  title: string;

  get hasTitle(): boolean {
    return !!this.title;
  }
}

@NgModule({
  declarations: [RowComponent],
  exports: [RowComponent],
  imports: [CommonModule],
})
export class RowModule {}
