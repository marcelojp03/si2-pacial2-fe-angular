import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import type { DashboardStats } from '../interfaces/dashboard.interface';

interface DashboardResponse {
  total_products: number;
  total_movements_today: number;
  low_stock_count: number;
  total_users: number;
  work_orders_active?: number;
  work_orders_finished_today?: number;
  materials_consumed_today?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeDashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.api.baseUrl}/dashboard`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/stats/`).pipe(
      map(response => ({
        total_products: response.total_products,
        total_warehouses: 0, // No disponible en el backend aún
        total_suppliers: 0, // No disponible en el backend aún
        total_movements_today: response.total_movements_today,
        low_stock_count: response.low_stock_count,
        total_users: response.total_users,
        work_orders_active: response.work_orders_active,
        work_orders_finished_today: response.work_orders_finished_today,
        materials_consumed_today: response.materials_consumed_today
      }))
    );
  }
}
