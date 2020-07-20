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
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowsAlt,
  faGripLinesVertical,
} from '@fortawesome/free-solid-svg-icons';
import { Column } from 'src/app/shared/api/grid/grid.model';

const MIN_WIDTH = 100;

function __distanceInColumns(
  initialWidth: number,
  distanceX: number,
  columnSize: number
): number {
  const columnWidth = initialWidth / columnSize;
  return Math.round(distanceX / columnWidth);
}

function __actualColumnSize(
  columnSize: number,
  distanceInColumns: number
): number {
  const actualColumnSize = columnSize + distanceInColumns;
  if (actualColumnSize > 12) {
    return 12;
  }
  if (actualColumnSize <= 0) {
    return 1;
  }
  return actualColumnSize;
}

@Component({
  selector: 'app-column-content-placeholder',
  templateUrl: './column-content-placeholder.component.html',
  styleUrls: ['./column-content-placeholder.component.scss'],
})
export class ColumnContentPlaceholderComponent
  implements AfterViewChecked, OnChanges {
  @Input()
  column: Column<any>;

  @Output()
  changeSize: EventEmitter<Column<any>> = new EventEmitter<Column<any>>();

  @HostBinding('class.dragging')
  isDragging = false;

  initialWidth: number;

  actualColumnSize: number;

  faArrowsAlt = faArrowsAlt;

  faGripLinesVertical = faGripLinesVertical;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.actualColumnSize = this.column.size;
  }

  ngAfterViewChecked(): void {
    if (!this.isDragging) {
      this.initialWidth = this.elementRef.nativeElement.offsetWidth;
    }
  }

  onDragMove(event: CdkDragMove<Column<any>>) {
    console.log(event);
    this.isDragging = true;
    this.actualColumnSize = __actualColumnSize(
      this.column.size,
      __distanceInColumns(this.initialWidth, event.distance.x, this.column.size)
    );
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
    this.renderer.removeStyle(this.elementRef.nativeElement, 'width');
    this.changeSize.emit({
      ...this.column,
      size: __actualColumnSize(
        this.column.size,
        __distanceInColumns(
          this.initialWidth,
          event.distance.x,
          this.column.size
        )
      ),
    });
  }
}

@NgModule({
  declarations: [ColumnContentPlaceholderComponent],
  imports: [CommonModule, FontAwesomeModule, DragDropModule],
  exports: [ColumnContentPlaceholderComponent],
})
export class ColumnContentPlaceholderModule {}
