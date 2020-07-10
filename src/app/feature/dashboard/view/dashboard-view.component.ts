import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DashboardFacade } from '../+state/dashboard.facade';
import { Dashboard } from '../+state/dashboard.model';
import { SharedGridModule } from '../../../shared/grid/shared-grid.module';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent {
  dashboard$: Observable<Dashboard> = this.activatedRoute.paramMap.pipe(
    map((paramMap) => paramMap.get('id')),
    mergeMap((id) => this.facade.getById(id))
  );
  constructor(
    private activatedRoute: ActivatedRoute,
    private facade: DashboardFacade
  ) {}
}

@NgModule({
  declarations: [DashboardViewComponent],
  imports: [CommonModule, SharedGridModule],
  exports: [DashboardViewComponent],
})
export class DashboardViewModule {}
