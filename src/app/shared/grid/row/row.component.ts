import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowsAltV,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Row } from '../../api/grid/grid.model';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RowComponent implements OnChanges, OnDestroy {
  private subscriptions: Subscription[] = [];

  @HostBinding('class.row') cssClassRow = true;

  @HostBinding('class.align-items-end') cssClassAlignItemsEnd = true;

  @Input()
  editable: boolean;

  @Input()
  deletable: boolean;

  @Input()
  row: Row<any>;

  @Output()
  titleChanged = new EventEmitter<Row<any>>();

  @Output()
  addedAfter = new EventEmitter<Row<any>>();

  @Output()
  deleted = new EventEmitter<Row<any>>();

  faPlus = faPlus;

  faArrowsAltV = faArrowsAltV;

  faTimes = faTimes;

  rowForm: FormGroup;

  get hasTitle(): boolean {
    return !!this.row?.title;
  }

  get isEditable(): boolean {
    return this.editable;
  }

  get isDeletable(): boolean {
    return this.deletable;
  }

  constructor(private formBuilder: FormBuilder) {
    this.rowForm = this.formBuilder.group({
      title: [''],
    });
    this.subscriptions.push(
      this.rowForm.valueChanges
        .pipe(
          debounceTime(500),
          tap(console.log),
          map(({ title }) => ({ ...this.row, title })),
          tap((row) => this.titleChanged.emit(row))
        )
        .subscribe()
    );
  }

  onAddAfter(row: Row<any>) {
    this.addedAfter.emit(row);
  }

  onDelete(row: Row<any>) {
    this.deleted.emit(row);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !!changes.row &&
      !!changes.row.currentValue &&
      changes.row.currentValue !== changes.row.previousValue
    ) {
      const { title } = changes.row.currentValue;
      this.rowForm.patchValue(
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
  declarations: [RowComponent],
  exports: [RowComponent],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
})
export class RowModule {}
