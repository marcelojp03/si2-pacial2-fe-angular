export interface CartItem {
  product_id: number;
  variant_id?: number;
  name: string;
  variant_name?: string;
  price: number;
  quantity: number;
  image_url?: string;
  sku?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface CheckoutData {
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  payment_method: 'QR' | 'CARD' | 'CASH' | 'TRANSFER';
  notes?: string;
}

export interface CheckoutResponse {
  order_id: number;
  order_number: string;
  payment_url?: string;
  qr_code?: string;
  message: string;
}
