export interface Attribute {
  id?: number;
  name: string;
  code: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
  values?: string[]; // For select/multiselect
  required: boolean;
  description?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttributeResponse {
  data: Attribute[];
  total: number;
}
