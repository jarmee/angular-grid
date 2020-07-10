import { NgModule } from '@angular/core';
import { ColumnModule } from './column/column.component';
import { GridModule } from './grid.component';
import { RowModule } from './row/row.component';

@NgModule({
  imports: [RowModule, GridModule, ColumnModule],
  exports: [GridModule, RowModule, ColumnModule],
})
export class SharedGridModule {}
