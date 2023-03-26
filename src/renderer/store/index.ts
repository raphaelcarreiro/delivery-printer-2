import reducer from './reducers';

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer,
});

export { store };
