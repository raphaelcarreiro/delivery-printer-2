import { Restaurant } from 'renderer/types/restaurant';

export const SET_RESTAURANT = '@restaurant/SET_RESTAURANT';
export const SET_IS_OPEN = '@restaurant/SET_IS_OPEN';

export interface SetRestaurantAction {
  type: typeof SET_RESTAURANT;
  restaurant: Restaurant | null;
}

export interface SetRestaurantIsOpen {
  type: typeof SET_IS_OPEN;
  isOpen: boolean;
}

export type RestaurantActions = SetRestaurantAction | SetRestaurantIsOpen;
