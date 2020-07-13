import { Component, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContainerComponent {}

@NgModule({
  declarations: [ContainerComponent],
  exports: [ContainerComponent],
})
export class ContainerModule {}
