import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnComponent {
  @Input()
  size: number;

  isColumnOfSize(expected: number): boolean {
    return this.size === expected;
  }
}

@NgModule({
  declarations: [ColumnComponent],
  imports: [CommonModule],
  exports: [ColumnComponent],
})
export class ColumnModule {}
