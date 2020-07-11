export interface Column {
  id: string;
  title: string;
  size: number;
}
export type Columns = { [id: string]: Column }[];
export interface Row {
  id: string;
  title: string;
  columns: Columns;
}
export type Rows = { [id: string]: Row }[];
export interface Grid {
  id: string;
  rows: Rows;
}
