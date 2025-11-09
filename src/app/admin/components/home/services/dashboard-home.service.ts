import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { DashboardStats, DashboardStatsResponse, StockAlertsResponse } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardHomeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}`;

  /**
   * Obtiene KPIs del dashboard y los convierte al formato esperado
   * GET /api/dashboard/kpis
   */
  getKPIs(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/kpis`).pipe(
      map((response: any) => {
        // Convertir respuesta del backend al formato DashboardStats
        return {
          total_products: response.data?.total_products || 0,
          total_warehouses: 0, // No disponible en el backend aún
          total_suppliers: 0, // No disponible en el backend aún
          total_movements_today: response.data?.total_movements || 0,
          low_stock_count: response.data?.low_stock_products || 0,
          total_users: 0, // No disponible en el backend aún
          work_orders_active: 0,
          work_orders_finished_today: 0,
          materials_consumed_today: 0
        } as DashboardStats;
      })
    );
  }

  /**
   * Obtiene alertas de stock bajo
   * GET /api/stocks/low
   */
  getStockAlerts(): Observable<StockAlertsResponse> {
    return this.http.get<StockAlertsResponse>(`${this.apiUrl}/stocks/low`);
  }
}
