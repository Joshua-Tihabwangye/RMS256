export interface MenuItem {
  id: number;
  name: string;
  price: string;
  category: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface DashboardStats {
  daily_orders: number;
  weekly_orders: number;
  monthly_orders: number;
  most_placed_order: string;
  daily_revenue: number;
  weekly_revenue: number;
  monthly_revenue: number;
  yearly_revenue: number;
  unread_notifications_count_by_category: Record<string, number>;
}

export interface ChartData {
  daily_orders: number[];
  pie_chart_data: { category: string; total: number }[];
  weekly_orders: number[];
}

export interface OrderRow {
  id: number;
  table_number: number;
  food_type: string;
  number_of_people: number;
  unit_price: string | number;
  total_price: string | number;
  timestamps: string;
  is_read: boolean;
}

export type PlaceOrderPayload = {
  table_number: number;
  category: string;
  item_name: string;
  number_of_people: number;
};
