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

export interface DropColumnEvent<T> {
  row: Row<T>;
  draggedColumn: Column<T>;
  columnDroppedOn: Column<T>;
}

export interface SizeOfColumnChanged<T> {
  row: Row<T>;
  column: Column<T>;
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
  grid: Grid<any>;

  @Input()
  editable: boolean;

  @Output()
  dropColumn: EventEmitter<DropColumnEvent<any>> = new EventEmitter<
    DropColumnEvent<any>
  >();

  @Output()
  sizeOfColumnChanged: EventEmitter<
    SizeOfColumnChanged<any>
  > = new EventEmitter<SizeOfColumnChanged<any>>();

  faPen = faPen;

  isEditable = false;

  rowsOf({ rows }: Grid<any>): Row<any>[] {
    return Object.values<Row<any>>(rows);
  }

  trackByRowId({ id }: Row<any>) {
    return id;
  }

  columnsOf({ columns, order }: Row<any>): Column<any>[] {
    return order.map((columnId) => columns[columnId]);
  }

  trackByColumnIdAndSize({ id, size }: Column<any>) {
    return `${id}-${size}`;
  }

  onToggleEdit() {
    this.isEditable = !this.isEditable;
  }

  onChangeSize(row: Row<any>, column: Column<any>) {
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

  onRowDrop(row: Row<any>, dragDrop: CdkDragDrop<any>) {
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    const draggedColumn = dragDrop.item.data as Column<any>;
    const columnDroppedOn = dragDrop.container.data as Column<any>;
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
