import { Dashboard as InternalDashboard } from '../../../shared/api/dashboard/dashboard.model';
import { Grid } from '../../../shared/api/grid/grid.model';

export interface DashboardElement {}

export type Dashboard = InternalDashboard & Grid<DashboardElement>;

export interface DashboardState {
  dashboard: Dashboard;
}

export const initialState: DashboardState = {
  dashboard: null,
};
