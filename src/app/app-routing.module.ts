import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/overview/feature-overview.module').then(
        (m) => m.FeatureOverviewModule
      ),
  },
  {
    path: 'element/dashboard',
    loadChildren: () =>
      import('./feature/dashboard/feautre-dashboard.module').then(
        (m) => m.FeautreDashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
