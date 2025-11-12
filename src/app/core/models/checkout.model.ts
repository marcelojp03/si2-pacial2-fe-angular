// ========================================
// CHECKOUT MODELS
// ========================================

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'BANK_TRANSFER' | 'QR';
export type PaymentProvider = 'STRIPE' | 'PAYPAL' | 'MOCK';

export interface CheckoutRequest {
  customer_id: number;
  shipping_address_id: number;
  payment_method: PaymentMethod;
  payment_provider?: PaymentProvider;
  notes?: string;
}

export interface ConfirmPaymentRequest {
  idempotency_key?: string;
  provider?: PaymentProvider;
  provider_ref?: string;
}

export interface Payment {
  id: number;
  method: PaymentMethod;
  provider: PaymentProvider;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  amount: string;
  paid_at?: string;
  provider_ref?: string;
}

export interface CheckoutResponse {
  id: number;
  order_number: string;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  items: Array<{
    id: number;
    variant: {
      code: string;
      product_name: string;
      price: string;
    };
    quantity: number;
    price: string;
    subtotal: string;
  }>;
  shipping_address: {
    id: number;
    street: string;
    city: string;
    state?: string;
    country: string;
    postal_code: string;
  };
  subtotal: string;
  tax: string;
  shipping_cost: string;
  discount: string;
  total: string;
  status: string;
  payment_status: string;
  payment: Payment;
  notes?: string;
  created_at: string;
}

export interface ConfirmPaymentResponse {
  message: string;
  order: CheckoutResponse;
}

// Maps para UI
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CREDIT_CARD: 'Tarjeta de Crédito',
  DEBIT_CARD: 'Tarjeta de Débito',
  CASH: 'Efectivo',
  BANK_TRANSFER: 'Transferencia Bancaria',
  QR: 'Código QR'
};

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  STRIPE: 'Stripe',
  PAYPAL: 'PayPal',
  MOCK: 'Pago Simulado'
};
