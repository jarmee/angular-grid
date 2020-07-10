export interface Column {
  size: number;
}
export type Columns = Column[];
export interface Row {
  columns: Columns;
}
export type Rows = Row[];
export interface Grid {
  id: string;
  rows: Rows;
}
