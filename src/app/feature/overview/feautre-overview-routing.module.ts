import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  OverviewViewModule,
  OverviewViewComponent,
} from './view/overview-view.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewViewComponent,
  },
];

@NgModule({
  imports: [OverviewViewModule, RouterModule.forChild(routes), CommonModule],
})
export class FeautreOverviewRoutingModule {}
