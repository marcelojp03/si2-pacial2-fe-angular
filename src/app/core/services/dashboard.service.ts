import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Local interfaces for dashboard
interface DashboardStatsResponse {
  success: boolean;
  data: {
    total_products: number;
    low_stock_products: number;
    total_movements: number;
    recent_movements: any[];
  };
}

interface StockAlertsResponse {
  success: boolean;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/dashboard`;

  /**
   * Obtiene KPIs del dashboard (productos, stock bajo, movimientos)
   * GET /api/dashboard/kpis
   * Endpoint real según documentación
   */
  getKPIs(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.apiUrl}/kpis`);
  }

  /**
   * Obtiene alertas de stock bajo
   * GET /api/stocks/low
   * Endpoint correcto según documentación
   */
  getAlerts(): Observable<StockAlertsResponse> {
    return this.http.get<StockAlertsResponse>(`${environment.api.baseUrl}/stocks/low`);
  }
}