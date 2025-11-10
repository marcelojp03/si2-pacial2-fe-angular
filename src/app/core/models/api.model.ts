/**
 * Modelos genéricos para respuestas de API
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ErrorResponse {
  detail?: string;
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}
