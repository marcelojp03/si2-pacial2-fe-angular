// ========================================
// ANALYTICS MODELS
// ========================================

export interface SaleFact {
  id: number;
  date: string;
  order: number;
  product: number;
  product_name: string;
  variant: number;
  category: number;
  category_name: string;
  qty: number;
  unit_price: number;
  revenue: number;
  discount: number;
}

export interface DashboardMetrics {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  total_items_sold: number;
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  items: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  total_revenue: number;
  total_qty: number;
  order_count: number;
}

export interface TopCategory {
  category_id: number;
  category_name: string;
  total_revenue: number;
  total_qty: number;
}

export interface SalesDashboard {
  period: string;
  date_from: string;
  date_to: string;
  metrics: DashboardMetrics;
  daily_sales: DailySales[];
  top_products: TopProduct[];
  top_categories: TopCategory[];
}

export interface ReportRequest {
  date_from: string;
  date_to: string;
  category?: number | null;
  product?: number | null;
  format: 'json' | 'csv' | 'pdf' | 'excel';
}

export interface ReportResponse {
  report_type: string;
  period: {
    from: string;
    to: string;
  };
  filters: {
    category?: number | null;
    product?: number | null;
  };
  summary: DashboardMetrics;
  details: any[];
  file_url?: string;
}

export interface ForecastPrediction {
  date: string;
  predicted_qty: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface ForecastResponse {
  product_id: number;
  product_name: string;
  model_type: string;
  periods: number;
  historical_data: {
    avg_daily_sales: number;
    days_with_sales: number;
    total_qty: number;
  };
  forecast: ForecastPrediction[];
}

export interface ForecastModel {
  id: number;
  name: string;
  model_type: 'LINEAR_REGRESSION' | 'ARIMA' | 'PROPHET';
  parameters: any;
  created_at: string;
}

export interface Report {
  id: number;
  name: string;
  report_type: 'SALES' | 'INVENTORY' | 'CUSTOMER';
  parameters: any;
  format: 'json' | 'csv' | 'pdf' | 'excel';
  file_url?: string;
  created_at: string;
}
