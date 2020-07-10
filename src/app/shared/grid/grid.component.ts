import { Component, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GridComponent {}

@NgModule({
  declarations: [GridComponent],
  exports: [GridComponent],
})
export class GridModule {}
