import { Dashboard as InternalDashboard } from '../../../shared/api/dashboard/dashboard.model';
import { Column, Grid } from '../../../shared/api/grid/grid.model';

export interface DashboardElement {}

export type Dashboard = InternalDashboard & Grid<DashboardElement>;

export type Recommendation = Column<DashboardElement>;

export type Recommendations = Recommendation[];

export interface DashboardState {
  dashboard: Dashboard;
}

export const initialState: DashboardState = {
  dashboard: null,
};
