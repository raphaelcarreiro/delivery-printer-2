import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { OrderData } from 'renderer/types/order';
import { useSelector } from 'renderer/store/selector';
import { Theme } from '@material-ui/core';
import PrintTypography from '../../base/print-typography/PrintTypography';
import Header from './shared-parts/Header';
import Address from './shared-parts/Address';
import ComplementCategories from './shared-parts/ComplementCategories';

interface UseStylesProps {
  fontSize: number;
  noMargin: boolean;
  marginSize: number;
}

const useStyles = makeStyles<Theme, UseStylesProps>({
  container: props => ({
    width: '100%',
    maxWidth: '80mm',
    minHeight: 300,
    padding: 15,
    fontSize: props.fontSize,
    backgroundColor: '#faebd7',
    border: '2px dashed #ccc',
    '@media print': {
      '&': {
        backgroundColor: 'transparent',
        border: 'none',
        padding: props.noMargin ? 0 : props.marginSize,
        marginRight: 0,
      },
    },
  }),
  annotation: {
    marginLeft: 10,
  },
  products: {
    marginBottom: 15,
    padding: '5px 0 0',
    borderTop: '1px dashed #333',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerProducts: {
    marginTop: 7,
  },
  productName: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 600,
  },
  product: {
    width: '100%',
    paddingBottom: 10,
  },
  productAmount: {
    minWidth: 25,
    display: 'flex',
    paddingTop: 0,
  },
  customerData: {
    display: 'grid',
    gridTemplateColumns: '75px 1fr',
    marginBottom: 2,
    columnGap: 7,
  },
  title: {
    fontWeight: 600,
  },
  date: {
    marginBottom: 10,
  },
  complementCategory: {
    display: 'grid',
    gridTemplateColumns: '0.5fr 1fr',
    alignItems: 'center',
  },
  totals: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    rowGap: '4px',
    '& div': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  developer: {
    marginTop: 15,
  },
  header: {
    textAlign: 'center',
    borderBottom: '1px dashed #000',
    paddingBottom: 10,
    marginBottom: 10,
  },
  user: {
    marginTop: 15,
  },
});

interface DispatchedOrderProps {
  handleClose(): void;
  data: OrderData;
}

const DispatchedOrder: React.FC<DispatchedOrderProps> = ({ handleClose, data }) => {
  const restaurant = useSelector(state => state.restaurant);
  const order = useMemo(() => JSON.parse(JSON.stringify(data)), [data]);
  const classes = useStyles({
    fontSize: restaurant?.printer_settings?.font_size || 14,
    noMargin: !!restaurant?.printer_settings?.no_margin,
    marginSize: restaurant?.printer_settings.margin_size ?? 15,
  });
  const [toPrint, setToPrint] = useState<OrderData>(JSON.parse(JSON.stringify(order)));
  const [printedQuantity, setPrintedQuantity] = useState(0);

  const copies = useMemo(() => {
    return restaurant?.printer_settings.shipment_template_copies || 1;
  }, [restaurant]);

  useEffect(() => {
    if (toPrint.printed) {
      handleClose();
      return;
    }

    if (printedQuantity === copies) {
      setToPrint({
        ...toPrint,
        printed: true,
      });
      return;
    }

    window.electron
      .print()
      .then(() => {
        setPrintedQuantity(state => state + 1);
      })
      .catch(err => {
        console.error(err);
        handleClose();
      });
  }, [toPrint, handleClose, copies, printedQuantity]);

  return (
    <>
      {toPrint && !toPrint.printed && (
        <div className={classes.container}>
          <Header formattedSequence={order.formattedSequence} shipment={order.shipment} />

          <PrintTypography gutterBottom>{order.formattedDate}</PrintTypography>

          <div className={classes.customerData}>
            <PrintTypography noWrap>Cliente</PrintTypography>
            <PrintTypography>{order.customer.name}</PrintTypography>
          </div>
          <div className={classes.customerData}>
            <PrintTypography noWrap>Telefone</PrintTypography>
            <PrintTypography>{order.customer.phone}</PrintTypography>
          </div>
          {order.shipment.shipment_method === 'delivery' && (
            <div className={classes.customerData}>
              <PrintTypography noWrap>Endereço</PrintTypography>
              <div>
                <Address shipment={order.shipment} />
              </div>
            </div>
          )}
          <table className={classes.headerProducts}>
            <tbody>
              <tr>
                <td>
                  <PrintTypography>Qtd</PrintTypography>
                </td>
                <td>
                  <PrintTypography>Item</PrintTypography>
                </td>
              </tr>
            </tbody>
          </table>
          <div className={classes.products}>
            <table>
              <tbody>
                {order.products.map(product => (
                  <tr key={product.id}>
                    <td className={classes.productAmount}>
                      <PrintTypography>{product.amount}x</PrintTypography>
                    </td>
                    <td className={classes.product}>
                      <PrintTypography upperCase bold>
                        {product.name} - {product.formattedFinalPrice}
                      </PrintTypography>

                      <ComplementCategories categories={product.complement_categories} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={classes.totals}>
            <div>
              <PrintTypography>Pagamento</PrintTypography>
            </div>
            <div>{order.payment_method.mode === 'online' ? `Online` : order.payment_method.method}</div>
            {order.discount > 0 && (
              <>
                <div>
                  <PrintTypography>Desconto</PrintTypography>
                </div>
                <div>
                  <PrintTypography>{order.formattedDiscount}</PrintTypography>
                </div>
              </>
            )}
            {order.tax > 0 && (
              <>
                <div>
                  <PrintTypography>Taxa de entrega</PrintTypography>
                </div>
                <div>
                  <PrintTypography>{order.formattedTax}</PrintTypography>
                </div>
              </>
            )}
            {order.change > 0 && (
              <>
                <div>
                  <PrintTypography>Troco para</PrintTypography>
                </div>
                <div>
                  <PrintTypography>{order.formattedChangeTo}</PrintTypography>
                </div>
                <div>
                  <PrintTypography>Troco</PrintTypography>
                </div>
                <div>
                  <PrintTypography>{order.formattedChange}</PrintTypography>
                </div>
              </>
            )}
            <div>
              <PrintTypography>{order.payment_method.mode === 'online' ? 'Total' : 'Total a pagar'}</PrintTypography>
            </div>
            <div>
              <PrintTypography fontSize={1.2} bold>
                {order.formattedTotal}
              </PrintTypography>
            </div>
            {order.deliverers.length > 0 && (
              <>
                {order.deliverers.map(deliverer => (
                  <Fragment key={deliverer.id}>
                    <div>
                      <PrintTypography>Entregador</PrintTypography>
                    </div>
                    <div>
                      <PrintTypography>{deliverer.name}</PrintTypography>
                    </div>
                  </Fragment>
                ))}
              </>
            )}
          </div>

          {order.admin_user && (
            <div className={classes.user}>
              <PrintTypography>
                Emitido por <strong>{order.admin_user.name}</strong>
              </PrintTypography>
            </div>
          )}

          <div className={classes.developer}>
            <PrintTypography fontSize={0.9} align="center">
              www.sgrande.delivery
            </PrintTypography>
          </div>
        </div>
      )}
    </>
  );
};

export default DispatchedOrder;
