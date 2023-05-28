import { useCallback } from 'react';
import { api } from 'renderer/services/api';

interface UseSetOrderPrinted {
  setOrderAsPrinted(): Promise<void>;
}

export function useSetOrderPrinted(handleClose: () => void, orderId: number): UseSetOrderPrinted {
  const trySendRequest = useCallback(async () => {
    await api.post(`/orders/printed`, { order_id: orderId });
    handleClose();
  }, [handleClose, orderId]);

  const onError = useCallback(
    (err: unknown) => {
      console.log(err);
      handleClose();
    },
    [handleClose]
  );

  const setOrderAsPrinted = useCallback(async () => {
    try {
      await trySendRequest();
    } catch (err) {
      onError(err);
    }
  }, [onError, trySendRequest]);

  return {
    setOrderAsPrinted,
  };
}
