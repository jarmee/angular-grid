import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

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
  imports: [CommonModule],
})
export class RowModule {}
