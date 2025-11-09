// Product interfaces for admin module
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

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: {
    id: number;
    name: string;
  };
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
  updated_at?: string;
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

export interface ProductFormData {
  name: string;
  slug?: string;
  description?: string;
  category?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  is_featured?: boolean;
}

export interface ProductFilters {
  category?: number;
  search?: string;
  status?: string;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
}

export interface ProductStats {
  total_products: number;
  active_products: number;
  featured_products: number;
  draft_products: number;
}
