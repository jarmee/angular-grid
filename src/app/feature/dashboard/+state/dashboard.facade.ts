import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DashboardService } from 'src/app/shared/api/dashboard/dashboard.service';
import { GridService } from 'src/app/shared/api/grid/grid.service';
import { Dashboard } from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  constructor(
    private dashboardService: DashboardService,
    private gridService: GridService
  ) {}

  getById(id: string): Observable<Dashboard> {
    return this.dashboardService.getById(id).pipe(
      mergeMap((dashboard) =>
        this.gridService.getById(dashboard.id).pipe(
          map(
            (grid) =>
              ({
                ...dashboard,
                ...grid,
              } as Dashboard)
          ),
          map((dashboard) => dashboard[0])
        )
      )
    );
  }
}
