export type OrderStatusOptions = 'p' | 'o' | 'a' | 'd' | 'c' | 'x';
export interface OrderStatus {
  id: number;
  order_id: number;
  status: OrderStatusOptions;
  created_at: string;
  updated_at: string;
  formattedDate: string;
}
