import { NgModule } from '@angular/core';
import { ColumnModule } from './column/column.component';
import { ColumnContentPlaceholderModule } from './column/content/placeholder/column-content-placeholder.component';
import { ContainerModule } from './container/container.component';
import { GridLayoutModule } from './grid-layout.component';
import { RowModule } from './row/row.component';

@NgModule({
  imports: [
    RowModule,
    ContainerModule,
    ColumnModule,
    GridLayoutModule,
    ColumnContentPlaceholderModule,
  ],
  exports: [
    ContainerModule,
    RowModule,
    ColumnModule,
    GridLayoutModule,
    ColumnContentPlaceholderModule,
  ],
})
export class SharedGridModule {}
