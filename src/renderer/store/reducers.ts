import { combineReducers } from 'redux';
import restaurant from './modules/restaurant/reducer';
import user from './modules/user/reducer';

const reducers = combineReducers({ user, restaurant });

export default reducers;
