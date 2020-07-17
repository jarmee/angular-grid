import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import {
  ColumnDeleted,
  DropColumnEvent,
  DropRowEvent,
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

const CSS_CLASS_NAME_DRAG_PLACEHOLDER = '.cdk-drag-placeholder';
const CSS_CLASS_NAME_DROP_ZONE = 'app-column-show-as-drop-zone';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardViewComponent {
  dashboard$: Observable<Dashboard> = this.facade.dashboard$;

  faPen = faPen;

  isEditable = false;

  constructor(
    private facade: DashboardFacade,
    private activatedRoute: ActivatedRoute
  ) {
    this.facade.loadById(this.activatedRoute.snapshot.paramMap.get('id'));
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
