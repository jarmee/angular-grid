import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList, faPen } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Row } from 'src/app/shared/api/grid/grid.model';
import {
  ColumnDeleted,
  DropColumnEvent,
  DropRowEvent,
  EditableChanged,
  GridLayoutComponent,
  RowAddedAfter,
  RowDeleted,
  SizeOfColumnChanged,
  TitleOfColumnChanged,
  TitleOfGridChanged,
  TitleOfRowChanged,
} from 'src/app/shared/grid/grid-layout.component';
import { DashboardFacade } from '../+state/dashboard.facade';
import { Dashboard, DashboardElement } from '../+state/dashboard.model';
import { SharedGridModule } from '../../../shared/grid/shared-grid.module';
import { DashboardViewElementModule } from './element/dashboard-view-element.component';

function __generateDropzoneIdsFromRow(row: Row<DashboardElement>) {
  if (!row) {
    return [];
  }
  if (!row.order.length) {
    return [`empty-row-${row.id}`];
  }
  return row.order.reduce(
    (result, columnId) => [...result, `column-${row.id}-${columnId}`],
    []
  );
}

function __generateDropzoneIdsFrom(dashboard: Dashboard): string[] {
  console.log(dashboard);
  if (!dashboard) {
    return [];
  }
  if (!dashboard.rows) {
    return [];
  }
  return dashboard.order
    .map((rowId) => dashboard.rows[rowId])
    .map(__generateDropzoneIdsFromRow)
    .reduce((result, dropzoneIds) => [...result, ...dropzoneIds], []);
}

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardViewComponent {
  @ViewChild(GridLayoutComponent)
  gridComponentRef: GridLayoutComponent;

  dashboard$: Observable<Dashboard> = this.facade.dashboard$;

  dropzoneIds$: Observable<string[]> = this.dashboard$.pipe(
    map(__generateDropzoneIdsFrom)
  );

  faPen = faPen;

  faList = faList;

  isEditable = false;

  dropZoneIds: string[] = [];

  testColumn = {
    id: null,
    size: 3,
    title: 'Test',
    data: null,
  };

  dropzoneIdsInternal = 'colum-9-2';

  constructor(
    private facade: DashboardFacade,
    private activatedRoute: ActivatedRoute
  ) {
    this.facade.loadById(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  onGridEditableChanged({ editable }: EditableChanged<DashboardElement>) {
    this.isEditable = editable;
  }

  onTitleOfGridChanged({ grid }: TitleOfGridChanged<Dashboard>) {
    this.facade.update(grid);
  }

  onRowDrop({ draggedRow, rowDroppedOn }: DropRowEvent<DashboardElement>) {
    this.facade.updateRowOrder(draggedRow, rowDroppedOn);
  }

  onTitleOfRowChanged({ row }: TitleOfRowChanged<DashboardElement>) {
    this.facade.updateRow(row);
  }

  onRowAddedAfter({ row }: RowAddedAfter<DashboardElement>) {
    console.log(row);
    this.facade.addRowAfter(row);
  }

  onRowDeleted({ row }: RowDeleted<DashboardElement>) {
    this.facade.deleteRow(row);
  }

  onColumnDrop({
    row,
    draggedColumn,
    columnDroppedOn,
  }: DropColumnEvent<DashboardElement>) {
    console.log(draggedColumn);
    this.facade.updateColumnOrder(row.id, draggedColumn, columnDroppedOn);
  }

  onTitleOfColumnChanged({
    row,
    column,
  }: TitleOfColumnChanged<DashboardElement>) {
    this.facade.updateColumn(row.id, column);
  }

  onSizeOfColumnChanged({
    row,
    column,
  }: SizeOfColumnChanged<DashboardElement>) {
    this.facade.updateColumn(row.id, column);
  }

  onColumnDeleted({ row, column }: ColumnDeleted<DashboardElement>) {
    this.facade.deleteColumn(row.id, column);
  }
}

@NgModule({
  declarations: [DashboardViewComponent],
  imports: [
    CommonModule,
    SharedGridModule,
    DashboardViewElementModule,
    DragDropModule,
    FontAwesomeModule,
  ],
  exports: [DashboardViewComponent],
})
export class DashboardViewModule {}
