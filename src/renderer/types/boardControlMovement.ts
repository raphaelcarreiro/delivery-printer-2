import { BoardMovement } from './boardMovement';
import { BoardMovementPayment } from './boardMovementPayment';
import { BoardOrderProduct } from './boardOrderProduct';

export interface BoardControlMovement extends BoardMovement {
  payments: BoardMovementPayment[];
  products: BoardOrderProduct[];
  isBoardPaid: boolean;
  total: number;
  formattedTotal: string;
  totalPaid: number;
  formattedTotalPaid: string;
  discount: number;
  formattedDiscount: string;
}
