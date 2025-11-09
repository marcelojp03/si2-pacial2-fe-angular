// ========================================
// CATALOG MODELS
// ========================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | null;
  parent_name?: string;
  children?: Category[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AttributeValue {
  id: number;
  value: string;
  display_value: string;
}

export interface Attribute {
  id: number;
  name: string;
  display_name: string;
  values?: AttributeValue[];
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  code: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  cost?: number;
  stock_on_hand: number;
  attributes: VariantAttribute[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: Category;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  is_featured: boolean;
  category_names?: string[];
  main_image?: string;
  price_range?: {
    min: number;
    max: number;
  };
  variants?: ProductVariant[];
  images?: ProductImage[];
  created_at?: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: string;
  is_featured: boolean;
  category_names: string[];
  main_image?: string;
  price_range: {
    min: number;
    max: number;
  };
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
