import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { GridLayoutModule } from 'src/app/shared/grid/grid-layout.component';
import { OverviewFacade } from '../+state/overview.facade';
import { Overview } from '../+state/overview.model';

@Component({
  selector: 'app-overview-view',
  templateUrl: './overview-view.component.html',
  styleUrls: ['./overview-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OverviewViewComponent {
  overview$: Observable<Overview> = this.facade.overview$;

  faList = faList;

  constructor(private facade: OverviewFacade, private router: Router) {}

  onSelect(type: string, id: number) {
    this.router.navigate(['element', type, id]);
  }
}

@NgModule({
  declarations: [OverviewViewComponent],
  exports: [OverviewViewComponent],
  imports: [CommonModule, RouterModule, GridLayoutModule, FontAwesomeModule],
})
export class OverviewViewModule {}
