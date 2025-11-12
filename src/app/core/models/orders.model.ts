// ========================================
// ORDERS & SALES MODELS
// ========================================

export interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  variant_code?: string;
  quantity: number;
  unit_price: string;
  discount: string;
  tax: string;
  subtotal: string;
  total: string;
  product_id?: number;
  variant_id?: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  customer_name?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  subtotal: string;
  tax: string;
  shipping_cost: string;
  discount: string;
  total: string;
  notes?: string;
  shipping_address?: string;
  billing_address?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
}

export type OrderStatus = 
  | 'CREATED'      // Pedido creado
  | 'CONFIRMED'    // Pedido confirmado
  | 'PROCESSING'   // En proceso
  | 'SHIPPED'      // Enviado
  | 'DELIVERED'    // Entregado
  | 'CANCELLED';   // Cancelado

export type PaymentStatus =
  | 'PENDING'      // Pago pendiente
  | 'PAID'         // Pagado
  | 'FAILED'       // Pago fallido
  | 'REFUNDED';    // Reembolsado

export interface OrderStatusBadge {
  severity: 'success' | 'info' | 'warning' | 'danger' | 'secondary';
  label: string;
  icon: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusBadge> = {
  'CREATED': { severity: 'info', label: 'Creado', icon: 'pi-file' },
  'CONFIRMED': { severity: 'info', label: 'Confirmado', icon: 'pi-check-circle' },
  'PROCESSING': { severity: 'warning', label: 'En Proceso', icon: 'pi-cog' },
  'SHIPPED': { severity: 'info', label: 'Enviado', icon: 'pi-send' },
  'DELIVERED': { severity: 'success', label: 'Entregado', icon: 'pi-check' },
  'CANCELLED': { severity: 'danger', label: 'Cancelado', icon: 'pi-times-circle' }
};

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, OrderStatusBadge> = {
  'PENDING': { severity: 'warning', label: 'Pendiente', icon: 'pi-clock' },
  'PAID': { severity: 'success', label: 'Pagado', icon: 'pi-check-circle' },
  'FAILED': { severity: 'danger', label: 'Fallido', icon: 'pi-times-circle' },
  'REFUNDED': { severity: 'secondary', label: 'Reembolsado', icon: 'pi-replay' }
};

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
}
