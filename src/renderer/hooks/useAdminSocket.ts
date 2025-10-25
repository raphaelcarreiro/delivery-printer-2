import { useEffect, useSyncExternalStore } from 'react';
import { useSelector } from 'renderer/store/selector';
import { SocketStore } from 'renderer/store/socket-store';

const store = new SocketStore('admin');

export function useAdminSocket() {
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    if (restaurant) {
      store.connect(restaurant.uuid);
    }
  }, [restaurant]);

  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store)
  );
}
