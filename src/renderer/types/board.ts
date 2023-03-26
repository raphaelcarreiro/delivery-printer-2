import { BoardMovement } from './boardMovement';

export interface Board {
  id: string;
  restaurant_id: number;
  number: string;
  qr_code: string;
  description: string;
  active: boolean;
  created_at: string;
  customer_name_required: boolean;
  delivery_location_required: boolean;
  max_value: number;
  formattedCreatedAt?: string;
  formattedCustomerNameRequired?: string;
  formattedDeliveryLocationRequired?: string;
  formattedActive?: string;
  formattedType?: string;
  formattedMaxValue?: string;
  state?: 'busy' | 'free';
}

export interface BoardChart extends Board {
  current_movement: BoardMovement | null;
  state?: 'busy' | 'free';
}
