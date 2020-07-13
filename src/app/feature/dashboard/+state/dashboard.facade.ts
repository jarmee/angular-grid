import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/shared/api/dashboard/dashboard.service';
import { Column } from 'src/app/shared/api/grid/grid.model';
import { GridService } from 'src/app/shared/api/grid/grid.service';
import { Dashboard, DashboardState, initialState } from './dashboard.model';

function __updateColumn(rowId: string, column: Column) {
  return (dashboard: Dashboard): Dashboard => {
    return {
      ...dashboard,
      rows: {
        ...dashboard.rows,
        [rowId]: {
          ...dashboard.rows[rowId],
          columns: {
            ...dashboard.rows[rowId].columns,
            [column.id]: column,
          },
        },
      },
    };
  };
}

function __updateColumnOrder(rowId: string, source: Column, target: Column) {
  return (dashboard: Dashboard): Dashboard => {
    const row = dashboard.rows[rowId];
    const columnOrder = row.order;
    const sourceIndex = columnOrder.indexOf(source.id);
    const targetIndex = columnOrder.indexOf(target.id);
    moveItemInArray(columnOrder, sourceIndex, targetIndex);
    return {
      ...dashboard,
      rows: {
        ...dashboard.rows,
        [row.id]: {
          ...row,
          order: columnOrder,
        },
      },
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private state$: BehaviorSubject<DashboardState> = new BehaviorSubject<
    DashboardState
  >(initialState);

  dashboard$: Observable<Dashboard> = this.state$.pipe(
    map((state) => state.dashboard)
  );

  constructor(
    private dashboardService: DashboardService,
    private gridService: GridService
  ) {}

  loadById(id: string) {
    this.subscriptions.push(
      this.dashboardService
        .getById(id)
        .pipe(
          mergeMap((dashboard) =>
            this.gridService.getById(dashboard.id).pipe(
              map(
                (grid) =>
                  ({
                    ...dashboard,
                    ...grid,
                  } as Dashboard)
              ),
              tap((mergedDashboard) =>
                this.state$.next({ dashboard: mergedDashboard })
              )
            )
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  updateColumn(rowId: string, column: Column) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__updateColumn(rowId, column)),
          tap((dashboard) => this.state$.next({ dashboard }))
        )
        .subscribe()
    );
  }

  updateColumnOrder(rowId: string, sourceColumn: Column, row: Column) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__updateColumnOrder(rowId, sourceColumn, row)),
          tap((dashboard) => this.state$.next({ dashboard })),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }
}
