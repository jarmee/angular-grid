import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Column } from '../../api/grid/grid.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnComponent implements OnInit, OnChanges, OnDestroy {
  private subscriptions: Subscription[] = [];

  @HostBinding('attr.id') id;
  @HostBinding('class.d-block') displayBlock = true;
  @HostBinding('class.my-2') marginTopBottom2 = true;
  @HostBinding('class.col-sm-12') cssClassColumnSizeSmall12 = true;
  @HostBinding('class.col-md-1') cssClassColumnSize1 = false;
  @HostBinding('class.col-md-2') cssClassColumnSize2 = false;
  @HostBinding('class.col-md-3') cssClassColumnSize3 = false;
  @HostBinding('class.col-md-4') cssClassColumnSize4 = false;
  @HostBinding('class.col-md-5') cssClassColumnSize5 = false;
  @HostBinding('class.col-md-6') cssClassColumnSize6 = false;
  @HostBinding('class.col-md-7') cssClassColumnSize7 = false;
  @HostBinding('class.col-md-8') cssClassColumnSize8 = false;
  @HostBinding('class.col-md-9') cssClassColumnSize9 = false;
  @HostBinding('class.col-md-10') cssClassColumnSize10 = false;
  @HostBinding('class.col-md-11') cssClassColumnSize11 = false;
  @HostBinding('class.col-md-12') cssClassColumnSize12 = false;

  @Input()
  column: Column<any>;

  @Input()
  editable: boolean;

  @Input()
  showTitle = true;

  @Output()
  titleChanged: EventEmitter<Column<any>> = new EventEmitter<Column<any>>();

  @Output()
  deleted: EventEmitter<Column<any>> = new EventEmitter<Column<any>>();

  columnForm: FormGroup;

  faTimes = faTimes;

  get isEditable(): boolean {
    return this.editable;
  }

  get hasTitle(): boolean {
    return this.showTitle && (!!this.column?.title || this.isEditable);
  }

  constructor(private formBuilder: FormBuilder) {
    this.columnForm = this.formBuilder.group({
      title: [''],
    });
    this.subscriptions.push(
      this.columnForm.valueChanges
        .pipe(
          debounceTime(500),
          map(({ title }) => ({ ...this.column, title })),
          tap((column) => this.titleChanged.emit(column))
        )
        .subscribe()
    );
  }

  onDelete(column: Column<any>) {
    this.deleted.emit(column);
  }

  ngOnInit() {
    this.cssClassColumnSize1 = this.isColumnOfSize(1);
    this.cssClassColumnSize2 = this.isColumnOfSize(2);
    this.cssClassColumnSize3 = this.isColumnOfSize(3);
    this.cssClassColumnSize4 = this.isColumnOfSize(4);
    this.cssClassColumnSize5 = this.isColumnOfSize(5);
    this.cssClassColumnSize6 = this.isColumnOfSize(6);
    this.cssClassColumnSize7 = this.isColumnOfSize(7);
    this.cssClassColumnSize8 = this.isColumnOfSize(8);
    this.cssClassColumnSize9 = this.isColumnOfSize(9);
    this.cssClassColumnSize10 = this.isColumnOfSize(10);
    this.cssClassColumnSize11 = this.isColumnOfSize(11);
    this.cssClassColumnSize12 = this.isColumnOfSize(12);
  }

  isColumnOfSize(expected: number): boolean {
    return this.column?.size === expected;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !!changes.column &&
      changes.column.currentValue !== changes.column.previousValue
    ) {
      const { title } = changes.column.currentValue;
      this.columnForm.patchValue(
        {
          title,
        },
        { emitEvent: false }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

@NgModule({
  declarations: [ColumnComponent],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  exports: [ColumnComponent],
})
export class ColumnModule {}
