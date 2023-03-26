import { Image } from './image';

export interface User {
  id?: number;
  image_id?: number;
  name: string;
  phone: string;
  email: string;
  image: Image;
  activated: boolean;
}
