export interface InventoryAdjustment {
  id?: number;
  productId: number;
  productName?: string;
  warehouseId: number;
  warehouseName?: string;
  type: 'increase' | 'decrease' | 'correction';
  quantity: number;
  reason: string;
  notes?: string;
  createdBy?: string;
  createdAt?: Date;
}

export interface AdjustmentResponse {
  data: InventoryAdjustment[];
  total: number;
}
