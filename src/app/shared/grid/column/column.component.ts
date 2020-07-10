import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Column } from '../../api/grid/grid.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnComponent {
  @Input()
  config: Column;

  @Input()
  editable: boolean;

  @Output()
  changeSize: EventEmitter<Column> = new EventEmitter<Column>();

  get isEditable(): boolean {
    return this.editable;
  }

  isColumnOfSize(expected: number): boolean {
    return this.config?.size === expected;
  }

  onDecrease() {
    this.changeSize.emit({ ...this.config, size: this.config.size - 1 });
  }

  onIncrease() {
    this.changeSize.emit({ ...this.config, size: this.config.size + 1 });
  }
}

@NgModule({
  declarations: [ColumnComponent],
  imports: [CommonModule],
  exports: [ColumnComponent],
})
export class ColumnModule {}
