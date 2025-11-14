import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { DashboardStats } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/dashboard`;

  getDashboardStats(): Observable<{ data: DashboardStats }> {
    return this.http.get<{ data: DashboardStats }>(`${this.apiUrl}/stats`);
  }
}
