import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import type { Warehouse, WarehouseStats, WarehouseFormData } from '../interfaces/warehouse.interface';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.api.baseUrl}/inventory/warehouses`;

  listWarehouses(filters?: any): Observable<PaginatedResponse<Warehouse>> {
    return this.http.get<PaginatedResponse<Warehouse>>(`${this.baseUrl}/`, { params: filters || {} });
  }

  getWarehouse(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.baseUrl}/${id}/`);
  }

  createWarehouse(data: WarehouseFormData): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.baseUrl}/`, data);
  }

  updateWarehouse(id: number, data: Partial<WarehouseFormData>): Observable<Warehouse> {
    return this.http.patch<Warehouse>(`${this.baseUrl}/${id}/`, data);
  }

  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }

  getWarehouseStats(): Observable<WarehouseStats> {
    return this.http.get<WarehouseStats>(`${this.baseUrl}/stats/`);
  }
}
