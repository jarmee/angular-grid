import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { OverviewFacade } from '../+state/overview.facade';
import { OverviewElement, OverviewElements } from '../+state/overview.model';

@Component({
  selector: 'app-overview-view',
  templateUrl: './overview-view.component.html',
  styleUrls: ['./overview-view.component.scss'],
})
export class OverviewViewComponent {
  elements$: Observable<OverviewElements> = this.facade.elements$;
  constructor(private facade: OverviewFacade, private router: Router) {}
  trackById(element: OverviewElement) {
    return element.id;
  }
  onSelect(id: number) {
    this.router.navigate(['element', id]);
  }
}

@NgModule({
  declarations: [OverviewViewComponent],
  exports: [OverviewViewComponent],
  imports: [CommonModule, RouterModule],
})
export class OverviewViewModule {}
