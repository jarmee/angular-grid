import { Dashboard as InternalDashboard } from '../../../shared/api/dashboard/dashboard.model';
import { Grid } from '../../../shared/api/grid/grid.model';

export type Dashboard = InternalDashboard & Grid;
