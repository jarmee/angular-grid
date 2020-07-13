import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  TemplateRef,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Column, Grid, Row } from '../api/grid/grid.model';
import { ColumnModule } from './column/column.component';
import { ContainerModule } from './container/container.component';
import { RowModule } from './row/row.component';

const CSS_CLASS_NAME_DRAG_PLACEHOLDER = '.cdk-drag-placeholder';
const CSS_CLASS_NAME_DROP_ZONE = 'app-column-show-as-drop-zone';

export interface DropColumnEvent {
  row: Row;
  draggedColumn: Column;
  columnDroppedOn: Column;
}

export interface SizeOfColumnChanged {
  row: Row;
  column: Column;
}

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent {
  @Input()
  columnTemplate: TemplateRef<any>;

  @Input()
  grid: Grid;

  @Input()
  editable: boolean;

  @Output()
  dropColumn: EventEmitter<DropColumnEvent> = new EventEmitter<
    DropColumnEvent
  >();

  @Output()
  sizeOfColumnChanged: EventEmitter<SizeOfColumnChanged> = new EventEmitter<
    SizeOfColumnChanged
  >();

  faPen = faPen;

  get isEditable(): boolean {
    return this.editable;
  }

  rowsOf({ rows }: Grid): Row[] {
    return Object.values<Row>(rows);
  }

  trackByRowId({ id }: Row) {
    return id;
  }

  columnsOf({ columns, order }: Row): Column[] {
    return order.map((columnId) => columns[columnId]);
  }

  trackByColumnIdAndSize({ id, size }: Column) {
    return `${id}-${size}`;
  }

  onToggleEdit() {
    this.editable = !this.isEditable;
  }

  onChangeSize(row: Row, column: Column) {
    this.sizeOfColumnChanged.emit({ row, column });
  }

  onRowEnter(dragDrop: CdkDragDrop<any>) {
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    const placeHolderElement = dropListElement.querySelector(
      CSS_CLASS_NAME_DRAG_PLACEHOLDER
    );
    dropListElement.removeChild(placeHolderElement);
    dropListElement.classList.add(CSS_CLASS_NAME_DROP_ZONE);
  }

  onRowExit(dragDrop: CdkDragDrop<any>) {
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    dropListElement.classList.remove(CSS_CLASS_NAME_DROP_ZONE);
  }

  onRowDrop(row: Row, dragDrop: CdkDragDrop<any>) {
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    const draggedColumn = dragDrop.item.data as Column;
    const columnDroppedOn = dragDrop.container.data as Column;
    dropListElement.classList.remove(CSS_CLASS_NAME_DROP_ZONE);
    this.dropColumn.emit({
      row,
      draggedColumn,
      columnDroppedOn,
    });
  }
}

@NgModule({
  declarations: [GridLayoutComponent],
  imports: [
    CommonModule,
    RowModule,
    ContainerModule,
    ColumnModule,
    DragDropModule,
    FontAwesomeModule,
  ],
  exports: [GridLayoutComponent],
})
export class GridLayoutModule {}
