export interface Column<T> {
  id: string;
  title: string;
  size: number;
  item: T;
}
export type Columns<T> = { [id: string]: Column<T> };
export interface Row<T> {
  id: string;
  title: string;
  columns: Columns<T>;
  order: string[];
}
export type Rows<T> = { [id: string]: Row<T> };
export interface Grid<T> {
  id: string;
  title: string;
  rows: Rows<T>;
}
