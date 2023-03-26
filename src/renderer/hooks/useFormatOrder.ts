import { format, formatDistanceStrict, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { moneyFormat } from 'renderer/helpers/NumberFormat';
import { useCallback } from 'react';
import { OrderData } from 'renderer/types/order';

export function useFormarOrder(): (order: OrderData) => OrderData {
  function formatId(id: number) {
    return `#${`00000${id}`.slice(-6)}`;
  }

  return useCallback((order: OrderData) => {
    const date = parseISO(order.created_at);
    return {
      ...order,
      printed: false,
      formattedId: formatId(order.id),
      formattedSequence: formatId(order.sequence),
      formattedTotal: moneyFormat(order.total),
      formattedChange: moneyFormat(order.change - order.total),
      formattedChangeTo: moneyFormat(order.change),
      formattedDate: format(date, "PP 'ás' p", { locale: ptBR }),
      formattedSubtotal: moneyFormat(order.subtotal),
      formattedDiscount: moneyFormat(order.discount),
      formattedTax: moneyFormat(order.tax),
      dateDistance: formatDistanceStrict(date, new Date(), {
        locale: ptBR,
        roundingMethod: 'ceil',
      }),
      products: order.products.map(product => {
        product.formattedFinalPrice = moneyFormat(product.final_price);
        product.formattedPrice = moneyFormat(product.price);
        return product;
      }),
      shipment: {
        ...order.shipment,
        formattedScheduledAt: order.shipment.scheduled_at
          ? format(parseISO(order.shipment.scheduled_at), 'dd/MM/yy p', { locale: ptBR })
          : null,
      },
    };
  }, []);
}
