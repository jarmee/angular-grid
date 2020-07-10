import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-dashboard-view-element',
  templateUrl: './dashboard-view-element.component.html',
  styleUrls: ['./dashboard-view-element.component.scss'],
})
export class DashboardViewElementComponent {
  @Input()
  editable: boolean;

  get isEditable(): boolean {
    return this.editable;
  }
}

@NgModule({
  declarations: [DashboardViewElementComponent],
  exports: [DashboardViewElementComponent],
  imports: [CommonModule],
})
export class DashboardViewElementModule {}
