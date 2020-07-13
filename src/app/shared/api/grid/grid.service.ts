import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_PATH } from '../api.model';
import { Grid } from './grid.model';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor(
    @Inject(API_BASE_PATH) private basePath: string,
    private httpClient: HttpClient
  ) {}

  getById(id: string): Observable<Grid> {
    return this.httpClient.get<Grid>(`${this.basePath}/grid/${id}`);
  }

  update(id: string, grid: Grid): Observable<Grid> {
    return this.httpClient.patch<Grid>(`${this.basePath}/grid/${id}`, grid);
  }
}
