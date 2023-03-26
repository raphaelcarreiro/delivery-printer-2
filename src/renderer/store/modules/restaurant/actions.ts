import { Restaurant } from 'renderer/types/restaurant';
import { SET_RESTAURANT, RestaurantActions } from './types';

export function setRestaurant(restaurant: Restaurant | null): RestaurantActions {
  return {
    type: SET_RESTAURANT,
    restaurant,
  };
}

export function setRestaurantIsOpen(isOpen: boolean): RestaurantActions {
  return {
    type: '@restaurant/SET_IS_OPEN',
    isOpen,
  };
}
