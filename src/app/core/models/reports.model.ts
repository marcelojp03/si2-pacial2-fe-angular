/**
 * Modelos para Reportes con IA
 * Backend API v2.0
 */

export type ReportFormat = 'json' | 'csv' | 'excel' | 'pdf';

export interface AIReportRequest {
  query: string;           // Consulta en lenguaje natural
  format: ReportFormat;    // Formato de salida
  limit?: number;          // Límite de resultados (default: 100)
  dry_run?: boolean;       // Solo generar SQL sin ejecutar
}

export interface AIReportResponse {
  success: boolean;
  message: string;
  sql_query: string;
  execution_time: number;
  data: AIReportData;
  interpretation?: string;
}

export interface AIReportData {
  sql: string;
  columns: string[];
  rows: any[];
  row_count: number;
  interpretation: string;
  summary: AIReportSummary;
  export_options: ReportFormat[];
}

export interface AIReportSummary {
  total_rows: number;
  execution_time_ms: number;
}

export interface AIReportDryRunResponse {
  success: boolean;
  message: string;
  data: {
    sql: string;
  };
}

// Ejemplos de consultas comunes
export const AI_REPORT_EXAMPLES = [
  'Muéstrame las ventas de los últimos 30 días',
  'Top 10 productos más vendidos',
  'Total de ingresos por categoría',
  'Clientes con más compras este mes',
  'Productos con stock bajo de 10 unidades',
  'Ventas por día de la última semana',
  'Categorías más rentables',
  'Promedio de valor de pedido por mes',
  'Productos más vendidos por categoría',
  'Tendencia de ventas mensual del último año'
];

// Plantillas de consultas
export interface ReportTemplate {
  category: string;
  queries: string[];
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    category: 'Ventas',
    queries: [
      'Muéstrame las ventas de los últimos 30 días',
      'Total de ingresos por categoría',
      'Ventas por día de la última semana',
      'Promedio de valor de pedido por mes',
      'Tendencia de ventas mensual del último año'
    ]
  },
  {
    category: 'Productos',
    queries: [
      'Top 10 productos más vendidos',
      'Productos más vendidos por categoría',
      'Categorías más rentables'
    ]
  },
  {
    category: 'Inventario',
    queries: [
      'Productos con stock bajo de 10 unidades',
      'Movimientos de inventario de la última semana'
    ]
  },
  {
    category: 'Clientes',
    queries: [
      'Clientes con más compras este mes',
      'Clientes más valiosos por ingresos generados'
    ]
  }
];
