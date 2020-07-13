import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-view-element',
  templateUrl: './dashboard-view-element.component.html',
  styleUrls: ['./dashboard-view-element.component.scss'],
})
export class DashboardViewElementComponent {
  @Input()
  editable: boolean;

  faArrowsAlt = faArrowsAlt;

  get isEditable(): boolean {
    return this.editable;
  }
}

@NgModule({
  declarations: [DashboardViewElementComponent],
  exports: [DashboardViewElementComponent],
  imports: [CommonModule, FontAwesomeModule],
})
export class DashboardViewElementModule {}
