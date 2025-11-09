export interface InventoryItem {
  id: number;
  product_id: number;
  product_name: string;
  warehouse_id: number;
  warehouse_name: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  reorder_point: number;
  last_updated: string;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface InventoryStats {
  total_items: number;
  total_quantity: number;
  low_stock_items: number;
  out_of_stock_items: number;
}

export interface InventoryFilters {
  warehouse_id?: number;
  product_id?: number;
  status?: string;
  search?: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  product_name: string;
  warehouse_id: number;
  warehouse_name: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reference: string;
  notes?: string;
  created_at: string;
  created_by: string;
}
