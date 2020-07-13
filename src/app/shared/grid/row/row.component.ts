import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RowComponent {
  @HostBinding('class.row') row = true;

  @Input()
  editable: boolean;

  @Input()
  title: string;

  faPlus = faPlus;

  get hasTitle(): boolean {
    return !!this.title;
  }

  get isEditable(): boolean {
    return this.editable;
  }
}

@NgModule({
  declarations: [RowComponent],
  exports: [RowComponent],
  imports: [CommonModule, FontAwesomeModule],
})
export class RowModule {}
