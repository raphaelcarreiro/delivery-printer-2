import { Board } from './board';
import { Customer } from './customer';
import { User } from './user';

export interface BoardMovement {
  id: string;
  board_id: string;
  admin_user_id: number;
  admin_user: User;
  is_open: boolean;
  customer: Customer;
  created_at: string;
  formattedIsOpen: string;
  formattedCreatedAt: string;
  board_number: string;
  customerName: string;
  board: Board;
}
