// ========================================
// CHECKOUT MODELS
// ========================================

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'BANK_TRANSFER' | 'QR';
export type PaymentProvider = 'STRIPE' | 'PAYPAL' | 'VPAY' | 'MOCK';

export interface ShippingAddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  notes?: string;
}

export interface CheckoutRequest {
  customer_id: number;
  shipping_address_id?: number;  // Opcional: usar dirección existente
  shipping_address?: ShippingAddressData;  // Opcional: crear nueva dirección
  payment_method: PaymentMethod;
  payment_provider?: PaymentProvider;
  notes?: string;
}

export interface VPayQRData {
  qr_id: string;
  qr_image: string;  // Base64
  expiration_date: string;
}

export interface PaymentStatusResponse {
  payment_status: 'PENDING' | 'PAID';
  order_status: string;
  vpay_status?: 'PEN' | 'PAG';
  paid_at?: string;
  message: string;
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
  customer: number;
  customer_name: string;
  shipping_address: number;
  status: string;
  payment_status: string;
  currency: string;
  subtotal: string;
  discount_total: string;
  shipping_total: string;
  total: string;
  items: Array<{
    id: number;
    variant: number;
    variant_code: string;
    product_name: string;
    qty: number;
    unit_price: string;
    discount: string;
    subtotal: string;
  }>;
  payment: Payment;
  total_items: number;
  notes?: string;
  vpay_qr?: VPayQRData;  // ✅ Datos del QR de VPAY (solo si provider=VPAY)
  created_at: string;
  updated_at: string;
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
  VPAY: 'VPAY (Pago QR)',
  MOCK: 'Pago Simulado'
};
