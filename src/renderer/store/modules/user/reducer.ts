import { User } from 'renderer/types/user';
import { UserActions, SET_USER } from './types';

const INITIAL_STATE: User = {} as User;

export default function user(state = INITIAL_STATE, action: UserActions): User {
  switch (action.type) {
    case SET_USER: {
      return {
        ...action.user,
      };
    }

    default: {
      return state;
    }
  }
}
