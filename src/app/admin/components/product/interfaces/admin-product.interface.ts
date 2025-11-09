export interface AdminProduct {
  id?: number;
  name: string;
  description: string;
  category_id: number;
  category_name?: string;
  base_price: number;
  currency: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  is_active: boolean;
  is_featured: boolean;
  stock_quantity?: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id?: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
}

export interface ProductVariant {
  id?: number;
  sku: string;
  name: string;
  price: number;
  stock_quantity: number;
  attributes: VariantAttribute[];
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface ProductStats {
  total_products: number;
  active_products: number;
  featured_products: number;
  out_of_stock: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  category_id: number;
  base_price: number;
  currency: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  is_active: boolean;
  is_featured: boolean;
}
