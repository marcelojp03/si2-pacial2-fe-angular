export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  company_name?: string;
  customer_type: 'INDIVIDUAL' | 'BUSINESS';
  ci_nit?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CustomerStats {
  total: number;
  active: number;
  business: number;
  individual: number;
}

export interface CustomerFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  customer_type: 'INDIVIDUAL' | 'BUSINESS';
  is_active: boolean;
}
