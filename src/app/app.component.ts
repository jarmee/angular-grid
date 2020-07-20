import { Component } from '@angular/core';
import { faTh } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { TitleFacade } from './shared/title/+state/title.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title$: Observable<string> = this.facade.title$;

  faTh = faTh;

  constructor(private facade: TitleFacade) {}
}
