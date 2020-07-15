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

  getById<T>(id: string): Observable<Grid<T>> {
    return this.httpClient.get<Grid<T>>(`${this.basePath}/grid/${id}`);
  }

  update<T>(id: string, grid: Grid<T>): Observable<Grid<T>> {
    return this.httpClient.patch<Grid<T>>(`${this.basePath}/grid/${id}`, grid);
  }
}
