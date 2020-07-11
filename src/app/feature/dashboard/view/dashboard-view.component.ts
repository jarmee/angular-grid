import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Column, Columns, Rows } from 'src/app/shared/api/grid/grid.model';
import { DashboardFacade } from '../+state/dashboard.facade';
import { Dashboard } from '../+state/dashboard.model';
import { SharedGridModule } from '../../../shared/grid/shared-grid.module';
import { DashboardViewElementModule } from './element/dashboard-view-element.component';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent {
  dashboard$: Observable<Dashboard> = this.facade.dashboard$;

  isEditable = false;

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    console.log(drag, drop);
  };

  constructor(
    private facade: DashboardFacade,
    private activatedRoute: ActivatedRoute
  ) {
    this.facade.loadById(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  rows(rows: Rows) {
    return Object.values(rows);
  }

  trackById(itemWithId: { id: string }) {
    return itemWithId.id;
  }

  columns(columns: Columns) {
    return Object.values(columns);
  }

  onToggleEdit() {
    this.isEditable = !this.isEditable;
  }

  onChangeSize(rowId: string, column: Column) {
    this.facade.updateColumn(rowId, column);
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
