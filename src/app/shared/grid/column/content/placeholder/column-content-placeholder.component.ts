import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgModule,
  Output,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowsAlt,
  faGripLinesVertical,
} from '@fortawesome/free-solid-svg-icons';
import { Column } from 'src/app/shared/api/grid/grid.model';

const MIN_WIDTH = 100;

@Component({
  selector: 'app-column-content-placeholder',
  templateUrl: './column-content-placeholder.component.html',
  styleUrls: ['./column-content-placeholder.component.scss'],
})
export class ColumnContentPlaceholderComponent implements AfterViewChecked {
  @Input()
  column: Column<any>;

  @Output()
  changeSize: EventEmitter<Column<any>> = new EventEmitter<Column<any>>();

  @HostBinding('class.dragging')
  isDragging = false;

  initialWidth: number;

  placeholder: TemplateRef<any>;

  faArrowsAlt = faArrowsAlt;

  faGripLinesVertical = faGripLinesVertical;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewChecked(): void {
    if (!this.isDragging) {
      this.initialWidth = this.elementRef.nativeElement.offsetWidth;
    }
  }

  onDragMove(event: CdkDragMove<Column<any>>) {
    this.isDragging = true;
    const distanceX = event.distance.x;
    let newWidth = this.initialWidth + distanceX;
    if (newWidth <= MIN_WIDTH) {
      newWidth = MIN_WIDTH;
    }
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'width',
      `${newWidth}px`
    );
  }

  onDragEnded(event: CdkDragEnd) {
    this.isDragging = false;
    const distanceX = event.distance.x;
    const columnWidth = this.initialWidth / this.column.size;
    const distanceInColumns = Math.round(distanceX / columnWidth);
    this.renderer.removeStyle(this.elementRef.nativeElement, 'width');
    this.changeSize.emit({
      ...this.column,
      size: this.column.size + distanceInColumns,
    });
  }
}

@NgModule({
  declarations: [ColumnContentPlaceholderComponent],
  imports: [CommonModule, FontAwesomeModule, DragDropModule],
  exports: [ColumnContentPlaceholderComponent],
})
export class ColumnContentPlaceholderModule {}
