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
import { ColumnContentPlaceholderModule } from './column/content/placeholder/column-content-placeholder.component';
import { ContainerModule } from './container/container.component';
import { RowModule } from './row/row.component';

const CSS_CLASS_NAME_DRAG_PLACEHOLDER = '.cdk-drag-placeholder';
const CSS_CLASS_NAME_DROP_ZONE = 'app-column-show-as-drop-zone';

export interface DropRowEvent<T> {
  draggedRow: Row<T>;
  rowDroppedOn: Row<T>;
}

export interface TitleOfRowChanged<T> {
  row: Row<T>;
}

export interface RowDeleted<T> {
  row: Row<T>;
}

export interface DropColumnEvent<T> {
  row: Row<T>;
  draggedColumn: Column<T>;
  columnDroppedOn: Column<T>;
}

export interface TitleOfColumnChanged<T> {
  row: Row<T>;
  column: Column<T>;
}

export interface SizeOfColumnChanged<T> {
  row: Row<T>;
  column: Column<T>;
}

export interface ColumnDeleted<T> {
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
  dropRow: EventEmitter<DropRowEvent<any>> = new EventEmitter<
    DropRowEvent<any>
  >();

  @Output()
  titleOfRowChanged: EventEmitter<TitleOfRowChanged<any>> = new EventEmitter<
    TitleOfRowChanged<any>
  >();

  @Output()
  rowDeleted: EventEmitter<RowDeleted<any>> = new EventEmitter<
    RowDeleted<any>
  >();

  @Output()
  dropColumn: EventEmitter<DropColumnEvent<any>> = new EventEmitter<
    DropColumnEvent<any>
  >();

  @Output()
  titleOfColumnChanged: EventEmitter<
    TitleOfColumnChanged<any>
  > = new EventEmitter<TitleOfColumnChanged<any>>();

  @Output()
  sizeOfColumnChanged: EventEmitter<
    SizeOfColumnChanged<any>
  > = new EventEmitter<SizeOfColumnChanged<any>>();

  @Output()
  columnDeleted: EventEmitter<ColumnDeleted<any>> = new EventEmitter<
    ColumnDeleted<any>
  >();

  faPen = faPen;

  isEditable = false;

  rowsOf({ rows, order }: Grid<any>): Row<any>[] {
    return order.map((rowsId) => rows[rowsId]);
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

  onRowDrop(dragDrop: CdkDragDrop<any>) {
    const draggedRow = dragDrop.item.data as Row<any>;
    const droppedOnId = this.grid.order[dragDrop.currentIndex];
    const rowDroppedOn = this.grid.rows[droppedOnId];
    this.dropRow.emit({
      draggedRow,
      rowDroppedOn,
    });
  }

  onRowTitleChanged(row: Row<any>) {
    this.titleOfRowChanged.emit({ row });
  }

  onRowDeleted(row: Row<any>) {
    console.log(row);
    this.rowDeleted.emit({ row });
  }

  onColumnEnter(dragDrop: CdkDragDrop<any>) {
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    const placeHolderElement = dropListElement.querySelector(
      CSS_CLASS_NAME_DRAG_PLACEHOLDER
    );
    dropListElement.removeChild(placeHolderElement);
    dropListElement.classList.add(CSS_CLASS_NAME_DROP_ZONE);
  }

  onColumnExit(dragDrop: CdkDragDrop<any>) {
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    dropListElement.classList.remove(CSS_CLASS_NAME_DROP_ZONE);
  }

  onColumnDrop(row: Row<any>, dragDrop: CdkDragDrop<any>) {
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

  onColumnTitleChanged(row: Row<any>, column: Column<any>) {
    this.titleOfColumnChanged.emit({ row, column });
  }

  onChangeSize(row: Row<any>, column: Column<any>) {
    this.sizeOfColumnChanged.emit({ row, column });
  }

  onColumnDeleted(row: Row<any>, column: Column<any>) {
    console.log(row);
    this.columnDeleted.emit({ row, column });
  }
}

@NgModule({
  declarations: [GridLayoutComponent],
  imports: [
    CommonModule,
    RowModule,
    ContainerModule,
    ColumnModule,
    ColumnContentPlaceholderModule,
    DragDropModule,
    FontAwesomeModule,
  ],
  exports: [GridLayoutComponent],
})
export class GridLayoutModule {}
