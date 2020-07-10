import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-dashboard-view-element',
  templateUrl: './dashboard-view-element.component.html',
  styleUrls: ['./dashboard-view-element.component.scss'],
})
export class DashboardViewElementComponent {}

@NgModule({
  declarations: [DashboardViewElementComponent],
  exports: [DashboardViewElementComponent],
})
export class DashboardViewElementModule {}
