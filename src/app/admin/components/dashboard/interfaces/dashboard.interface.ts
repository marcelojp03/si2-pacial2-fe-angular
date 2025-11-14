export interface DashboardStats {
  todaySales: number;
  pendingOrders: number;
  lowStock: number;
  newCustomers: number;
}

export interface QuickAction {
  label: string;
  icon: string;
  color: string;
  route: string;
}
