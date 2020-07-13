import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Column, Row } from 'src/app/shared/api/grid/grid.model';
import { DashboardFacade } from '../+state/dashboard.facade';
import { Dashboard } from '../+state/dashboard.model';
import { SharedGridModule } from '../../../shared/grid/shared-grid.module';
import { DashboardViewElementModule } from './element/dashboard-view-element.component';

const CSS_CLASS_NAME_DRAG_PLACEHOLDER = '.cdk-drag-placeholder';
const CSS_CLASS_NAME_DROP_ZONE = 'app-column-show-as-drop-zone';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent {
  dashboard$: Observable<Dashboard> = this.facade.dashboard$;

  isEditable = false;

  constructor(
    private facade: DashboardFacade,
    private activatedRoute: ActivatedRoute
  ) {
    this.facade.loadById(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  rowsOf({ rows }: Dashboard): Row[] {
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
    this.isEditable = !this.isEditable;
  }

  onChangeSize(rowId: string, column: Column) {
    this.facade.updateColumn(rowId, column);
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

  onRowDrop(rowId: string, dragDrop: CdkDragDrop<any>) {
    const dropListComponent = dragDrop.container.element;
    const dropListElement = dropListComponent.nativeElement;
    const draggedColumn = dragDrop.item.data as Column;
    const columnDroppedOn = dragDrop.container.data as Column;
    this.facade.updateColumnOrder(rowId, draggedColumn, columnDroppedOn);
    dropListElement.classList.remove(CSS_CLASS_NAME_DROP_ZONE);
  }
}

@NgModule({
  declarations: [DashboardViewComponent],
  imports: [
    CommonModule,
    SharedGridModule,
    DashboardViewElementModule,
    DragDropModule,
  ],
  exports: [DashboardViewComponent],
})
export class DashboardViewModule {}
