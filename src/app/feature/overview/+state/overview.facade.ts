import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '../../../shared/api/dashboard/dashboard.service';
import { OverviewElements, OverviewElementType } from './overview.model';

@Injectable({
  providedIn: 'root',
})
export class OverviewFacade {
  elements$: Observable<
    OverviewElements
  > = this.dashboardService.dashboards$.pipe(
    map((dashboards) =>
      dashboards.map(({ id, title }) => ({
        id,
        title,
        type: OverviewElementType.Dashboard,
      }))
    )
  );
  constructor(private dashboardService: DashboardService) {}
}
