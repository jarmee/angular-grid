import { Grid } from 'src/app/shared/api/grid/grid.model';

export interface OverviewElement {
  id: string;
  title: string;
  type: OverviewElementType;
}

export type OverviewElements = OverviewElement[];

export enum OverviewElementType {
  Dashboard = 'dashboard',
}

export type Overview = Grid<OverviewElement>;
