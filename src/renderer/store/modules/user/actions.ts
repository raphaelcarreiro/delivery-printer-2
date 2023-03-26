import { User } from 'renderer/types/user';
import { SET_USER, UserActions } from './types';

export function setUser(user: User): UserActions {
  return {
    type: SET_USER,

    user,
  };
}
