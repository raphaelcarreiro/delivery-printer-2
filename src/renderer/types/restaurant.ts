import { Image } from './image';

export interface RestaurantConfigs {
  print_by_product: boolean;
  print_only_shipment: boolean;
}

export interface PrinterSetting {
  font_size: number;
  production_template_copies: number;
  shipment_template_copies: number;
  no_margin: boolean;
  max_width: number;
  margin_size: number;
}

export interface Restaurant {
  id: number;
  is_open: boolean;
  name: string;
  description: string;
  logo?: string;
  favicon?: string;
  keywords?: string;
  title?: string;
  url: string;
  cnpj: string;
  corporate_name: string;
  email: string;
  primary_color: string;
  secondary_color: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  image_id: number;
  cover_id: number;
  working_hours: string;
  configs: RestaurantConfigs;
  printer_settings: PrinterSetting;
  image: Image;
}
