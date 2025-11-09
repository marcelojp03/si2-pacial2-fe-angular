// Order interfaces
export interface OrderAddress {
  full_name?: string;
  street_address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  customer_name?: string;
  status: 'CREATED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  payment_method?: 'QR' | 'CARD' | 'CASH' | 'TRANSFER';
  payment_id?: string;
  payment?: number;
  subtotal: number;
  discount?: number;
  tax?: number;
  shipping_cost?: number;
  shipping_total?: number;
  total: number;
  currency: string;
  items: OrderItem[];
  shipping_address?: OrderAddress;
  billing_address?: OrderAddress;
  notes?: string;
  created_at: string;
  updated_at?: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  variant?: number;
  variant_name?: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderListItem {
  id: number;
  order_number: string;
  customer_name?: string;
  status: string;
  payment_status: string;
  total: number;
  currency: string;
  items?: OrderItem[];
  created_at: string;
}

export interface OrderStats {
  total_orders: number;
  total_amount: number;
  paid_count: number;
  pending_count: number;
  delivered_count: number;
}
