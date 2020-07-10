import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dashboard } from 'src/app/feature/dashboard/+state/dashboard.model';
import { API_BASE_PATH } from '../api.model';
import { Dashboards } from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  dashboards$: Observable<Dashboards> = this.httpClient.get<Dashboards>(
    `${this.basePath}/dashboard`
  );
  constructor(
    @Inject(API_BASE_PATH) private basePath: string,
    private httpClient: HttpClient
  ) {}

  getById(id: string): Observable<Dashboard> {
    return this.httpClient.get<Dashboard>(`${this.basePath}/dashboard/${id}`);
  }
}
