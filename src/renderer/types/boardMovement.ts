import { Board } from './board';
import { User } from './user';

export interface BoardMovement {
  id: string;
  board_id: string;
  admin_user_id: number;
  admin_user: User;
  is_open: boolean;
  created_at: string;
  formattedIsOpen: string;
  formattedCreatedAt: string;
  board_number: string;
  customerName: string;
  board?: Board;
}
