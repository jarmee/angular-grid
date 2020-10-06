import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBan, faEllipsisV, faPen } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Column, Grid, Row } from '../api/grid/grid.model';
import { ColumnModule } from './column/column.component';
import { ColumnContentPlaceholderModule } from './column/content/placeholder/column-content-placeholder.component';
import { ColumnDropzoneModule } from './column/dropzone/column-dropzone.component';
import { ContainerModule } from './container/container.component';
import { RowModule } from './row/row.component';

const CSS_CLASS_NAME_DRAG_PLACEHOLDER = '.cdk-drag-placeholder';
const CSS_CLASS_NAME_DROP_ZONE = 'app-column-show-as-drop-zone';
const MIN_ROWS = 1;
const EMPTY_COLUMN: Column<any> = {
  id: null,
  item: null,
  size: null,
  title: null,
};
const DEFAULT_DIMENSION = 32;

export interface EditableChanged<T> {
  editable: boolean;
  grid: Grid<T>;
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
  positionTypeGroup: PositionTypeGroup;
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

export enum PositionType {
  Left = 'Left',
  Right = 'Right',
  Top = 'Top',
  Bottom = 'Bottom',
  Center = 'Center',
}

export interface PositionTypeGroup {
  horizontal: PositionType;
  vertical: PositionType;
  absolute: PositionType;
}

function __calcInnerPosition(
  positionA: { x: number; y: number },
  positionB: { x: number; y: number }
): { x: number; y: number } {
  let x = positionA.x - positionB.x;
  let y = positionA.y - positionB.y;
  if (x < 0) {
    x = x * -1;
  }
  if (y < 0) {
    y = y * -1;
  }
  return {
    x,
    y,
  };
}

function __isTop(
  position: { x: number; y: number },
  width: number,
  height: number
): boolean {
  return (
    position.x >= 0 &&
    position.x <= width &&
    position.y >= 0 &&
    position.y <= height
  );
}

function __isRight(
  position: { x: number; y: number },
  width: number,
  height: number
): boolean {
  return (
    position.x >= width - DEFAULT_DIMENSION &&
    position.x <= width &&
    position.y >= 0 &&
    position.y <= height
  );
}

function __isBottom(
  position: { x: number; y: number },
  width: number,
  height: number
): boolean {
  return (
    position.x >= 0 &&
    position.x <= width &&
    position.y >= height - DEFAULT_DIMENSION &&
    position.y <= height
  );
}

function __isLeft(
  position: { x: number; y: number },
  width: number,
  height: number
): boolean {
  return (
    position.x >= 0 &&
    position.x <= width &&
    position.y >= 0 &&
    position.y <= height
  );
}

function __calcPositionType(
  innerPosition: { x: number; y: number },
  dimension: { width: number; height: number }
): PositionTypeGroup {
  let absolutePositionType;
  const { width, height } = dimension;
  if (__isTop(innerPosition, width, DEFAULT_DIMENSION + 40)) {
    absolutePositionType = PositionType.Top;
  } else if (__isRight(innerPosition, width, height)) {
    absolutePositionType = PositionType.Right;
  } else if (__isBottom(innerPosition, width, height)) {
    absolutePositionType = PositionType.Bottom;
  } else if (__isLeft(innerPosition, DEFAULT_DIMENSION, height)) {
    absolutePositionType = PositionType.Left;
  } else {
    absolutePositionType = PositionType.Center;
  }
  return {
    horizontal: __isLeft(innerPosition, width / 2, height)
      ? PositionType.Left
      : PositionType.Right,
    vertical: __isTop(innerPosition, width, height / 2)
      ? PositionType.Top
      : PositionType.Bottom,
    absolute: absolutePositionType,
  };
}

function __removePositionTypeCssClasses(
  renderer: Renderer2,
  elementRef: ElementRef
) {
  if (!elementRef) {
    return;
  }
  renderer.removeClass(elementRef.nativeElement, 'highlight-top');
  renderer.removeClass(elementRef.nativeElement, 'highlight-right');
  renderer.removeClass(elementRef.nativeElement, 'highlight-bottom');
  renderer.removeClass(elementRef.nativeElement, 'highlight-left');
  renderer.removeClass(elementRef.nativeElement, 'highlight-center');
}

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent implements OnDestroy, OnChanges {
  private subscriptions: Subscription[] = [];

  private lastPointerPositionOfColumn: { x: number; y: number } = null;

  private activeDropListElementRef: ElementRef<any> = null;

  @Input()
  columnTemplate: TemplateRef<any>;

  @Input()
  grid: Grid<any>;

  @Input()
  editable: boolean;

  @Input()
  lastPointerPosition: { x: number; y: number };

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

  faBan = faBan;

  isEditable = false;

  emptyColumn = EMPTY_COLUMN;

  get isAllowDeleteOnlyOnMultipleRows() {
    return this.grid?.order?.length > MIN_ROWS;
  }

  constructor(private formBuilder: FormBuilder, private renderer: Renderer2) {
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

  areColumnsAvailableIn({ order }: Row<any>): boolean {
    return order.length > 0;
  }

  dropListIdOf(row: Row<any>, column: Column<any>) {
    return `column-${row.id}-${column.id}`;
  }

  dropListIdForDropzoneOf(row: Row<any>) {
    return `empty-row-${row.id}`;
  }

  trackByColumnIdAndSize({ id, size }: Column<any>) {
    return `${id}-${size}`;
  }

  getPositionTypeGroup(elementRef: ElementRef) {
    const {
      x,
      y,
      width,
      height,
    } = elementRef.nativeElement.getBoundingClientRect();
    return __calcPositionType(
      __calcInnerPosition(this.lastPointerPositionOfColumn, { x, y }),
      { width, height }
    );
  }

  resetActiveDropListRef(): void {
    __removePositionTypeCssClasses(
      this.renderer,
      this.activeDropListElementRef
    );
    this.activeDropListElementRef = null;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove({ x: mouseX, y: mouseY }: MouseEvent) {
    this.lastPointerPositionOfColumn = { x: mouseX, y: mouseY };
    if (!!this.activeDropListElementRef) {
      const positionTypeGroup = this.getPositionTypeGroup(
        this.activeDropListElementRef
      );
      __removePositionTypeCssClasses(
        this.renderer,
        this.activeDropListElementRef
      );
      this.renderer.addClass(
        this.activeDropListElementRef.nativeElement,
        `highlight-${positionTypeGroup.absolute.toLowerCase()}`
      );
    }
  }

  onToggleEdit(grid) {
    this.isEditable = !this.isEditable;
    this.editableChanged.emit({
      editable: this.isEditable,
      grid,
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
    this.activeDropListElementRef = dragDrop.container.element;
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    const placeHolderElement = dropListElement.querySelector(
      CSS_CLASS_NAME_DRAG_PLACEHOLDER
    );
    dropListElement.removeChild(placeHolderElement);
    dropListElement.classList.add(CSS_CLASS_NAME_DROP_ZONE);
  }

  onColumnExit(dragDrop: CdkDragDrop<any>) {
    this.resetActiveDropListRef();
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    dropListElement.classList.remove(CSS_CLASS_NAME_DROP_ZONE);
  }

  onColumnDrop(row: Row<any>, dragDrop: CdkDragDrop<any>) {
    this.resetActiveDropListRef();
    const dropListComponent = dragDrop.container.element;
    const positionTypeGroup = this.getPositionTypeGroup(dropListComponent);
    const dropListElement = dropListComponent.nativeElement;
    const draggedColumn = dragDrop.item.data as Column<any>;
    const columnDroppedOn = dragDrop.container.data as Column<any>;
    dropListElement.classList.remove(CSS_CLASS_NAME_DROP_ZONE);
    this.dropColumn.emit({
      row,
      draggedColumn,
      columnDroppedOn,
      positionTypeGroup,
    });
    this.lastPointerPositionOfColumn = null;
  }

  onColumnTitleChanged(row: Row<any>, column: Column<any>) {
    this.titleOfColumnChanged.emit({ row, column });
  }

  onChangeSize(row: Row<any>, column: Column<any>) {
    this.sizeOfColumnChanged.emit({ row, column });
  }

  onColumnDeleted(row: Row<any>, column: Column<any>) {
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
    ColumnDropzoneModule,
    DragDropModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  exports: [GridLayoutComponent],
})
export class GridLayoutModule {}
