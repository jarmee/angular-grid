import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DashboardViewComponent,
  DashboardViewModule,
} from './view/dashboard-view.component';

const routes: Routes = [
  {
    path: ':id',
    component: DashboardViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), DashboardViewModule],
  exports: [RouterModule],
})
export class FeautreDashboardRoutingModule {}
