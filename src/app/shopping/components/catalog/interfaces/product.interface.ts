export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: number;
  category_name?: string;
  base_price: number;
  currency: string;
  sku?: string;
  is_active: boolean;
  is_featured: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  attributes: VariantAttribute[];
}

export interface VariantAttribute {
  attribute_name: string;
  value: string;
}

export interface ProductFilters {
  category?: number;
  search?: string;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
}
