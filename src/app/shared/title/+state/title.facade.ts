import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { initialState, TitleState } from './title.model';

@Injectable({
  providedIn: 'root',
})
export class TitleFacade {
  private state$: BehaviorSubject<TitleState> = new BehaviorSubject<TitleState>(
    initialState
  );
  title$: Observable<string> = this.state$.pipe(map(({ title }) => title));

  setTtitle(title: string) {
    this.state$.next({ title });
  }
}
