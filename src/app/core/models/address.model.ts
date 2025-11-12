// ========================================
// ADDRESS MODELS
// ========================================

export interface Address {
  id: number;
  customer: number;
  street: string;
  city: string;
  state?: string;
  country: string;
  postal_code: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressRequest {
  customer: number;
  street: string;
  city: string;
  state?: string;
  country: string;
  postal_code: string;
  is_default?: boolean;
}

export interface UpdateAddressRequest {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  is_default?: boolean;
}
