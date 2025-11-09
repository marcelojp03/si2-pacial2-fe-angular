import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import type { InventoryItem, InventoryStats, InventoryFilters, StockMovement } from '../interfaces/inventory.interface';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.api.baseUrl}/inventory`;

  listInventory(filters?: InventoryFilters): Observable<PaginatedResponse<InventoryItem>> {
    return this.http.get<PaginatedResponse<InventoryItem>>(`${this.baseUrl}/inventory/`, { params: filters as any });
  }

  getInventoryStats(): Observable<InventoryStats> {
    return this.http.get<InventoryStats>(`${this.baseUrl}/inventory/stats/`);
  }

  getStockMovements(productId?: number, warehouseId?: number): Observable<PaginatedResponse<StockMovement>> {
    const params = { product_id: productId, warehouse_id: warehouseId };
    return this.http.get<PaginatedResponse<StockMovement>>(`${this.baseUrl}/movements/`, { params: params as any });
  }

  adjustStock(productId: number, warehouseId: number, quantity: number, notes?: string): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.baseUrl}/adjust/`, { 
      product_id: productId, 
      warehouse_id: warehouseId, 
      quantity, 
      notes 
    });
  }
}
