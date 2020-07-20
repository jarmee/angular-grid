import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable, OnDestroy } from '@angular/core';
import { cloneDeep, max, slice } from 'lodash';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/shared/api/dashboard/dashboard.service';
import { Column, Row } from 'src/app/shared/api/grid/grid.model';
import { GridService } from 'src/app/shared/api/grid/grid.service';
import {
  PositionType,
  PositionTypeGroup,
} from 'src/app/shared/grid/grid-layout.component';
import {
  Dashboard,
  DashboardElement,
  DashboardState,
  initialState,
  Recommendations,
} from './dashboard.model';

function __insertAfter(array: any[], source: any, target: any): any[] {
  const result = array.filter((element) => element !== source);
  const targetIndex = result.indexOf(target);
  result.splice(targetIndex + 1, 0, source);
  return result;
}

function __insertBefore(array: any[], source: any, target: any): any[] {
  const result = array.filter((element) => element !== source);
  const targetIndex = result.indexOf(target);
  result.splice(targetIndex, 0, source);
  return result;
}

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
  target: Column<DashboardElement>,
  { horizontal }: PositionTypeGroup
) {
  return (dashboard: Dashboard): Dashboard => {
    const row = dashboard.rows[rowId];
    if (!source.id && !target.id) {
      const newColumn = {
        ...cloneDeep(source),
        id: 1,
      };
      return {
        ...dashboard,
        rows: {
          ...dashboard.rows,
          [row.id]: {
            ...row,
            columns: {
              ...row.columns,
              [newColumn.id]: {
                ...newColumn,
              },
            },
            order: [newColumn.id],
          },
        },
      };
    } else if (!source.id) {
      source = {
        ...cloneDeep(source),
        id: `${max(row.order) + 1}`,
      };
      row.order.push(source.id);
      return {
        ...dashboard,
        rows: {
          ...dashboard.rows,
          [row.id]: {
            ...row,
            columns: {
              ...row.columns,
              [source.id]: {
                ...source,
              },
            },
            order: [
              ...(PositionType.Left === horizontal
                ? __insertBefore(row.order, source.id, target.id)
                : __insertAfter(row.order, source.id, target.id)),
            ],
          },
        },
      };
    } else {
      return {
        ...dashboard,
        rows: {
          ...dashboard.rows,
          [row.id]: {
            ...row,
            order: [
              ...(PositionType.Left === horizontal
                ? __insertBefore(row.order, source.id, target.id)
                : __insertAfter(row.order, source.id, target.id)),
            ],
          },
        },
      };
    }
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
  recommendations$: Observable<Recommendations> = of([
    {
      id: null,
      title: 'Virtueller PA alle Konten',
      size: 3,
      item: {},
    },
    {
      id: null,
      title: 'Anlage Miete Pro User',
      size: 6,
      item: {},
    },
  ]);

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

  update(dashboard: Dashboard) {
    this.subscriptions.push(
      of(dashboard)
        .pipe(
          tap((updateDashboard) =>
            this.state$.next({ dashboard: updateDashboard })
          ),
          mergeMap((updateDashboard) =>
            this.gridService.update(updateDashboard.id, updateDashboard)
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
    targetColumn: Column<DashboardElement>,
    positionTypeGroup: PositionTypeGroup
  ) {
    this.subscriptions.push(
      this.dashboard$
        .pipe(
          take(1),
          map(
            __updateColumnOrder(
              rowId,
              sourceColumn,
              targetColumn,
              positionTypeGroup
            )
          ),
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
