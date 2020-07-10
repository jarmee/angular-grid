export interface OverviewElement {
  id: number;
  title: string;
  type: OverviewElementType;
}

export type OverviewElements = OverviewElement[];

export enum OverviewElementType {
  Dashboard = 'dashboard',
}
