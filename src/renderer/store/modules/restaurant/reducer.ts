import { Restaurant } from 'renderer/types/restaurant';
import { RestaurantActions, SET_RESTAURANT, SET_IS_OPEN } from './types';

const INITIAL_STATE: Restaurant | null = null;

export default function restaurant(state = INITIAL_STATE, action: RestaurantActions): Restaurant | null {
  switch (action.type) {
    case SET_RESTAURANT: {
      if (!action.restaurant) return null;

      return {
        ...action.restaurant,
      };
    }
    case SET_IS_OPEN: {
      if (!state) return null;

      return {
        ...state,
        is_open: action.isOpen,
      };
    }

    default: {
      return state;
    }
  }
}
