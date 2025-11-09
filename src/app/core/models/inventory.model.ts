// ========================================
// INVENTORY MODELS
// ========================================

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string;
  is_active: boolean;
  total_products?: number;
  created_at: string;
}

export interface Inventory {
  id: number;
  variant: number;
  variant_code: string;
  warehouse: number;
  warehouse_name: string;
  stock_on_hand: number;
  stock_reserved: number;
  stock_available: number;
  min_stock: number;
  updated_at: string;
}

export interface StockAdjustmentRequest {
  quantity: number;
  reason: string;
}

export interface ReserveStockRequest {
  quantity: number;
}

export interface ConfirmSaleRequest {
  quantity: number;
}

export interface ReleaseStockRequest {
  quantity: number;
}
