import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '../../../shared/api/dashboard/dashboard.service';
import { Overview, OverviewElementType } from './overview.model';

@Injectable({
  providedIn: 'root',
})
export class OverviewFacade {
  overview$: Observable<Overview> = this.dashboardService.dashboards$.pipe(
    map((dashboards) =>
      dashboards
        .map(({ id, title }) => ({
          id,
          title,
          type: OverviewElementType.Dashboard,
        }))
        .reduce(
          (columns, element, index) => ({
            ...columns,
            [index + 1]: {
              id: index + 1,
              title: '',
              size: 3,
              item: element,
            },
          }),
          {}
        )
    ),
    map((columns) => ({
      id: '1',
      title: 'Overview',
      rows: {
        1: {
          id: '1',
          title: 'Online Templates',
          columns,
          order: Object.values(columns).map(({ id }) => id) as string[],
        },
      },
      order: ['1'],
    }))
  );
  constructor(private dashboardService: DashboardService) {}
}
