import { BoardMovement } from './boardMovement';

export interface PrinterData {
  id: number | string;
  name: string;
  order: OrderData;
  printed?: boolean;
  currentAmount?: number;
}

export interface ProductPrinterData {
  id: number | string;
  productId: number;
  name: string;
  order: OrderData;
  printed?: boolean;
  currentAmount: number;
}

export interface Additional {
  id: number;
  name: string;
  amount: number;
}

export interface Ingredient {
  id: number;
  name: string;
}

export interface ComplementCategory {
  id: number;
  name: string;
  print_name: string | null;
  complements: Complement[];
}

interface Complement {
  id: number;
  name: string;
  additional: ComplementAdditional[];
  ingredients: ComplementIngredient[];
}

type ComplementAdditional = Additional;
type ComplementIngredient = Ingredient;

export interface Product {
  id: number;
  name: string;
  final_price: number;
  price: number;
  formattedFinalPrice: string;
  formattedPrice: string;
  printer: PrinterData;
  amount: number;
  annotation: string;
  additional: Additional[];
  ingredients: Ingredient[];
  complement_categories: ComplementCategory[];
}

export interface Shipment {
  id: number;
  address: string;
  number: string;
  district: string;
  complement: string;
  formattedScheduledAt: string | null;
  scheduled_at: string | null;
  shipment_method: string;
  city: string;
  region: string;
}

interface Customer {
  name: string;
  phone: string;
}

interface PaymentMethod {
  id: number;
  method: string;
  mode: 'online' | 'offline';
}

interface Deliverer {
  id: number;
  name: string;
}

export interface OrderData {
  id: number;
  formattedId: string;
  formattedTotal: string;
  formattedChange: string;
  formattedChangeTo: string;
  formattedDate: string;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedTax: string;
  dateDistance: string;
  total: number;
  change: number;
  subtotal: number;
  discount: number;
  tax: number;
  created_at: string;
  products: Product[];
  shipment: Shipment;
  customer: Customer;
  payment_method: PaymentMethod;
  deliverers: Deliverer[];
  printed: boolean;
  sequence: number;
  formattedSequence: string;
  board_movement_id: number | null;
  board_movement: BoardMovement | null;
}
