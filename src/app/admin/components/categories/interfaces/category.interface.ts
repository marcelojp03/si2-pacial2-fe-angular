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

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  subcategories: number;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  is_active: boolean;
}
