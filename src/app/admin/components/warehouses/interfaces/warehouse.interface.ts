export interface Warehouse {
    id: number;
    name: string;
    location: string;
    org_id: number;
    created_at: string | null;
    updated_at: string | null;
}

export interface WarehousesResponse {
    data: Warehouse[];
    message: string;
    success: boolean;
}

export interface WarehouseRequest {
    name: string;
    location: string;
}

export interface WarehouseUpdateRequest extends WarehouseRequest {
    id: number;
}

// Interface for display in the component
export interface WarehouseVM {
    id: number;
    name: string;
    location: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface WarehouseStats {
    total_warehouses: number;
    active_warehouses: number;
    total_capacity: number;
    utilization_percentage: number;
}

export interface WarehouseFormData {
    name: string;
    location: string;
}