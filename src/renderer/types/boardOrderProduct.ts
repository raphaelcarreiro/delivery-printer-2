import { Product } from './order';
import { OrderStatusOptions } from './orderStatus';

export interface BoardOrderProduct extends Product {
  order_id: number;
  order_uuid: string;
  board_number: string;
  status: OrderStatusOptions;
  formattedStatus: string;
  admin_user_name: string;
}
