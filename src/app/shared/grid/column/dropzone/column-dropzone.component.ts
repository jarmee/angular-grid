import { CommonModule } from '@angular/common';
import { Component, HostBinding, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-column-dropzone',
  templateUrl: './column-dropzone.component.html',
  styleUrls: ['./column-dropzone.component.scss'],
})
export class ColumnDropzoneComponent {
  @HostBinding('class.col-12')
  cssClassCol12 = true;

  faPlus = faPlus;
}

@NgModule({
  declarations: [ColumnDropzoneComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [ColumnDropzoneComponent],
})
export class ColumnDropzoneModule {}
