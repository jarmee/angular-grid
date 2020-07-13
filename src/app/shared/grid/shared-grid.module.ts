import { NgModule } from '@angular/core';
import { ColumnModule } from './column/column.component';
import { ContainerModule } from './container/container.component';
import { GridLayoutModule } from './grid-layout.component';
import { RowModule } from './row/row.component';

@NgModule({
  imports: [RowModule, ContainerModule, ColumnModule, GridLayoutModule],
  exports: [ContainerModule, RowModule, ColumnModule, GridLayoutModule],
})
export class SharedGridModule {}
