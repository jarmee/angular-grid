import { Injectable } from '@angular/core';
import { TitleFacade } from './+state/title.facade';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(private facade: TitleFacade) {}
}
