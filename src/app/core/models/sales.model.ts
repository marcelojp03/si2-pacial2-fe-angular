// ========================================
// SALES MODELS
// ========================================

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string; // Computed field
  email: string;
  phone?: string;
  company_name?: string;
  customer_type: 'INDIVIDUAL' | 'BUSINESS';
  ci_nit?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Address {
  id: number;
  customer: number;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  is_default: boolean;
}

export interface CartItemVariant {
  id: number;
  code: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: number;
  variant: CartItemVariant;
  qty: number;
  unit_price: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  customer?: {
    id: number;
    full_name: string;
  };
  items: CartItem[];
  total_items: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  variant: {
    id: number;
    code: string;
  };
  qty: number;
  unit_price: number;
  discount: number;
  subtotal: number;
}

export interface Payment {
  id: number;
  provider: string;
  status: 'INIT' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  amount: number;
  paid_at?: string;
  idempotency_key?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer: Customer;
  status: 'CREATED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  currency: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  total: number;
  items: OrderItem[];
  shipping_address?: Address;
  payment?: Payment;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutRequest {
  customer_id: number;
  shipping_address_id: number;
  payment_method: string;
  payment_provider: string;
  notes?: string;
}

export interface ConfirmPaymentRequest {
  idempotency_key: string;
  provider: string;
  provider_ref: string;
}
