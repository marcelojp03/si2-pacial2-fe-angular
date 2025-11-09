// Order interfaces
export interface OrderCustomer {
  id: number;
  full_name: string;
  email: string;
}

export interface OrderAddress {
  id: number;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderPayment {
  id: number;
  provider: string;
  status: string;
  idempotency_key?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  customer_name?: string;
  customer_data?: OrderCustomer; // Datos completos del cliente
  status: 'CREATED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  payment_method?: 'QR' | 'CARD' | 'CASH' | 'TRANSFER';
  payment?: number;
  payment_data?: OrderPayment; // Datos completos del pago
  subtotal: number;
  discount?: number;
  shipping_total?: number;
  total: number;
  currency: string;
  items: OrderItem[];
  shipping_address?: number;
  shipping_address_data?: OrderAddress; // Datos completos de la dirección
  billing_address?: number;
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

export interface OrderFilters {
  status?: string;
  payment_status?: string;
  customer?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface UpdateOrderStatusRequest {
  status?: 'CREATED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  notes?: string;
}
