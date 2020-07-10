export interface OverviewElement {
  id: string;
  title: string;
  type: OverviewElementType;
}

export type OverviewElements = OverviewElement[];

export enum OverviewElementType {
  Dashboard = 'dashboard',
}
