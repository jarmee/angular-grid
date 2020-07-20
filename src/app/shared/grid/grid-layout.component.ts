import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisV, faPen } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Column, Grid, Row } from '../api/grid/grid.model';
import { ColumnComponent, ColumnModule } from './column/column.component';
import { ColumnContentPlaceholderModule } from './column/content/placeholder/column-content-placeholder.component';
import { ContainerModule } from './container/container.component';
import { RowModule } from './row/row.component';

const CSS_CLASS_NAME_DRAG_PLACEHOLDER = '.cdk-drag-placeholder';
const CSS_CLASS_NAME_DROP_ZONE = 'app-column-show-as-drop-zone';
const MIN_ROWS = 1;

export interface EditableChanged<T> {
  editable: boolean;
  grid: Grid<T>;
  componentInstance: GridLayoutComponent;
}

export interface TitleOfGridChanged<T> {
  grid: Grid<T>;
}

export interface DropRowEvent<T> {
  draggedRow: Row<T>;
  rowDroppedOn: Row<T>;
}

export interface TitleOfRowChanged<T> {
  row: Row<T>;
}

export interface RowAddedAfter<T> {
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
export class GridLayoutComponent implements OnDestroy, OnChanges {
  private subscriptions: Subscription[] = [];

  @ViewChildren(ColumnComponent, { read: ElementRef })
  columnElementRefs: ElementRef[];

  @Input()
  columnTemplate: TemplateRef<any>;

  @Input()
  grid: Grid<any>;

  @Input()
  editable: boolean;

  @Output()
  editableChanged = new EventEmitter<EditableChanged<any>>();

  @Output()
  titleChanged = new EventEmitter<TitleOfGridChanged<any>>();

  @Output()
  dropRow = new EventEmitter<DropRowEvent<any>>();

  @Output()
  titleOfRowChanged = new EventEmitter<TitleOfRowChanged<any>>();

  @Output()
  rowAddedAfter = new EventEmitter<RowAddedAfter<any>>();

  @Output()
  rowDeleted = new EventEmitter<RowDeleted<any>>();

  @Output()
  dropColumn = new EventEmitter<DropColumnEvent<any>>();

  @Output()
  titleOfColumnChanged = new EventEmitter<TitleOfColumnChanged<any>>();

  @Output()
  sizeOfColumnChanged = new EventEmitter<SizeOfColumnChanged<any>>();

  @Output()
  columnDeleted = new EventEmitter<ColumnDeleted<any>>();

  gridForm: FormGroup;

  faPen = faPen;

  faEllipsisV = faEllipsisV;

  isEditable = false;

  get isAllowDeleteOnlyOnMultipleRows() {
    return this.grid?.order?.length > MIN_ROWS;
  }

  constructor(
    private formBuilder: FormBuilder,
    private elementRef: ElementRef
  ) {
    this.gridForm = this.formBuilder.group({
      title: [''],
    });
    this.subscriptions.push(
      this.gridForm.valueChanges
        .pipe(
          debounceTime(500),
          map(({ title }) => ({ ...this.grid, title })),
          tap((grid) => this.titleChanged.emit({ grid }))
        )
        .subscribe()
    );
  }

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

  onToggleEdit(grid) {
    this.isEditable = !this.isEditable;
    this.editableChanged.emit({
      editable: this.isEditable,
      grid,
      componentInstance: this,
    });
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

  onRowAddedAfer(row: Row<any>) {
    this.rowAddedAfter.emit({ row });
  }

  onRowDeleted(row: Row<any>) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !!changes.grid &&
      !!changes.grid.currentValue &&
      changes.grid.currentValue !== changes.grid.previousValue
    ) {
      const { title } = changes.grid.currentValue;
      this.gridForm.patchValue(
        {
          title,
        },
        { emitEvent: false }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
    ReactiveFormsModule,
  ],
  exports: [GridLayoutComponent],
})
export class GridLayoutModule {}
