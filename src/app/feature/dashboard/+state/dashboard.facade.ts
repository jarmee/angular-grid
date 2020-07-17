import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable, OnDestroy } from '@angular/core';
import { cloneDeep, max, slice } from 'lodash';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/shared/api/dashboard/dashboard.service';
import { Column, Row } from 'src/app/shared/api/grid/grid.model';
import { GridService } from 'src/app/shared/api/grid/grid.service';
import {
  Dashboard,
  DashboardElement,
  DashboardState,
  initialState,
} from './dashboard.model';

function __addRowAfter(row: Row<DashboardElement>) {
  return (dashboard: Dashboard): Dashboard => {
    const maxIndex = max(dashboard.order);
    const newRow: Row<DashboardElement> = {
      id: `${parseInt(maxIndex, 0) + 1}`,
      columns: {},
      order: [],
      title: '',
    };
    const currentIndex = dashboard.order.indexOf(row.id);
    const insertAfterIndex = 1 + currentIndex;
    return {
      ...dashboard,
      rows: {
        ...dashboard.rows,
        [newRow.id]: {
          ...newRow,
        },
      },
      order: [
        ...slice(dashboard.order, 0, insertAfterIndex),
        newRow.id,
        ...slice(dashboard.order, insertAfterIndex),
      ],
    };
  };
}

function __updateRow(row: Row<DashboardElement>) {
  return (dashboard: Dashboard): Dashboard => {
    return {
      ...dashboard,
      rows: {
        ...dashboard.rows,
        [row.id]: {
          ...row,
        },
      },
    };
  };
}

function __updateRowOrder(
  source: Row<DashboardElement>,
  target: Row<DashboardElement>
) {
  return (dashboard: Dashboard): Dashboard => {
    const rowOrder = dashboard.order;
    const sourceIndex = rowOrder.indexOf(source.id);
    const targetIndex = rowOrder.indexOf(target.id);
    moveItemInArray(rowOrder, sourceIndex, targetIndex);
    return {
      ...dashboard,
      order: rowOrder,
    };
  };
}

function __removeRow(deletedRow: Row<DashboardElement>) {
  return (dashboard: Dashboard): Dashboard => {
    const updatedDashboard = cloneDeep(dashboard);
    delete updatedDashboard.rows[deletedRow.id];
    updatedDashboard.order = updatedDashboard.order.filter(
      (id) => id !== deletedRow.id
    );
    return updatedDashboard;
  };
}

function __updateColumn(rowId: string, column: Column<DashboardElement>) {
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

function __updateColumnOrder(
  rowId: string,
  source: Column<DashboardElement>,
  target: Column<DashboardElement>
) {
  return (dashboard: Dashboard): Dashboard => {
    const targetColumn = dashboard.rows[rowId];
    const columnOrder = targetColumn.order;
    const sourceIndex = columnOrder.indexOf(source.id);
    const targetIndex = columnOrder.indexOf(target.id);
    moveItemInArray(columnOrder, sourceIndex, targetIndex);
    return {
      ...dashboard,
      rows: {
        ...dashboard.rows,
        [targetColumn.id]: {
          ...targetColumn,
          order: columnOrder,
        },
      },
    };
  };
}

function __removeColumn(
  rowId: string,
  deletedColumn: Column<DashboardElement>
) {
  return (dashboard: Dashboard): Dashboard => {
    const updatedDashboard = cloneDeep(dashboard);
    delete updatedDashboard.rows[rowId].columns[deletedColumn.id];
    updatedDashboard.rows[rowId].order = updatedDashboard.rows[
      rowId
    ].order.filter((id) => id !== deletedColumn.id);
    return updatedDashboard;
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

  addRowAfter(row: Row<DashboardElement>) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__addRowAfter(row)),
          tap(console.log),
          tap((dashboard) => this.state$.next({ dashboard })),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }

  updateRow(row: Row<DashboardElement>) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__updateRow(row)),
          tap((dashboard) => this.state$.next({ dashboard })),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }

  updateRowOrder(
    sourceRow: Row<DashboardElement>,
    targetRow: Row<DashboardElement>
  ) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__updateRowOrder(sourceRow, targetRow)),
          tap((dashboard) => this.state$.next({ dashboard })),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }

  deleteRow(row: Row<DashboardElement>) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__removeRow(row)),
          tap((dashboard) => this.state$.next({ dashboard })),
          tap(console.log),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }

  updateColumn(rowId: string, column: Column<DashboardElement>) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__updateColumn(rowId, column)),
          tap((dashboard) => this.state$.next({ dashboard })),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }

  updateColumnOrder(
    rowId: string,
    sourceColumn: Column<DashboardElement>,
    targetColumn: Column<DashboardElement>
  ) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__updateColumnOrder(rowId, sourceColumn, targetColumn)),
          tap((dashboard) => this.state$.next({ dashboard })),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }

  deleteColumn(rowId: string, column: Column<DashboardElement>) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(__removeColumn(rowId, column)),
          tap((dashboard) => this.state$.next({ dashboard })),
          mergeMap((dashboard) =>
            this.gridService.update(dashboard.id, dashboard)
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
