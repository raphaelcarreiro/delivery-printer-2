import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { OrderData, PrinterData } from 'renderer/types/order';
import { api } from 'renderer/services/api';
import { Theme } from '@material-ui/core';
import { useSelector } from 'renderer/store/selector';
import Complements from './Complements';
import Address from './Address';
import PrintTypography from '../print-typography/PrintTypography';

interface UseStylesProps {
  fontSize: number;
  noMargin: boolean;
  maxWidth: number;
}

const useStyles = makeStyles<Theme, UseStylesProps>({
  container: props => ({
    maxWidth: `${props.maxWidth}mm`,
    minHeight: 300,
    padding: 15,
    fontSize: props.fontSize,
    backgroundColor: '#faebd7',
    border: '2px dashed #ccc',
    '@media print': {
      '&': {
        backgroundColor: 'transparent',
        border: 'none',
        padding: props.noMargin ? '0 0 0 0' : '0 0 0 10px',
        marginRight: 40,
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
    gridTemplateColumns: '60px 1fr',
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
  complement: {
    marginLeft: 6,
  },
  additional: {
    marginRight: 6,
  },
  ingredient: {
    marginRight: 6,
  },
  additionalInfoContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

interface PrintProps {
  handleClose(): void;
  order: OrderData;
}

const PrintOnlyShipment: React.FC<PrintProps> = ({ handleClose, order }) => {
  const restaurant = useSelector(state => state.restaurant);

  const classes = useStyles({
    fontSize: restaurant?.printer_settings?.font_size || 14,
    noMargin: !!restaurant?.printer_settings?.no_margin,
    maxWidth: restaurant?.printer_settings?.max_width || 80,
  });
  const [printers, setPrinters] = useState<PrinterData[]>([]);
  const [toPrint, setToPrint] = useState<PrinterData[]>([]);
  const [printedQuantity, setPrintedQuantity] = useState(0);

  const copies = useMemo(() => {
    return restaurant?.printer_settings.shipment_template_copies || 1;
  }, [restaurant]);

  // close if there is not printer in product
  useEffect(() => {
    const check = order.products.some(product => product.printer);
    if (!check) handleClose();
  }, [handleClose, order]);

  // get product printers
  useEffect(() => {
    if (order) {
      let productPrinters: PrinterData[] = [];
      order.products.forEach(product => {
        if (product.printer) {
          if (!productPrinters.some(printer => printer.id === product.printer.id))
            productPrinters.push(product.printer);
        }
      });

      productPrinters = productPrinters.map(_printer => {
        _printer.order = {
          ...order,
          products: order.products.filter(product => {
            return product.printer && product.printer.id === _printer.id;
          }),
        };
        _printer.printed = false;
        return _printer;
      });

      setPrinters(productPrinters);
    }
  }, [order]);

  useEffect(() => {
    async function setPrinted() {
      try {
        await api.post(`/orders/printed`, { order_id: order.id });
        console.log(`Alterado situação do pedido ${order.id}`);
        handleClose();
      } catch (err) {
        console.log(err);
        handleClose();
      }
    }

    if (printers.length > 0) {
      const tp = printers.find(p => !p.printed);

      // close if all order products had been printed
      if (!tp) {
        const check = printers.every(p => p.printed);
        if (check) setPrinted();
        return;
      }

      setToPrint([tp]);
    }
  }, [printers, handleClose, order]);

  // print
  useEffect(() => {
    if (!toPrint.length) return;

    const [printing] = toPrint;

    if (printedQuantity === copies) {
      setPrinters(oldPrinters =>
        oldPrinters.map(p => {
          if (p.id === printing.id) p.printed = true;
          return p;
        })
      );
      return;
    }

    window.electron
      .print(printing.name)
      .then(() => {
        setPrintedQuantity(state => state + 1);
      })
      .catch(err => {
        console.error(err);
        window.electron
          .print()
          .then(() => {
            setPrintedQuantity(state => state + 1);
          })
          .catch(err => {
            console.error(err);
            handleClose();
          });
      });
  }, [toPrint, handleClose, printedQuantity, copies]);

  return (
    <>
      {toPrint.length > 0 &&
        toPrint.map(printer => (
          <div key={printer.id} className={classes.container}>
            <PrintTypography fontSize={1.2} bold gutterBottom>
              PEDIDO {order.formattedSequence}
            </PrintTypography>
            <PrintTypography gutterBottom>{order.formattedDate}</PrintTypography>
            {order.shipment.shipment_method === 'customer_collect' && !order.shipment.scheduled_at && (
              <PrintTypography gutterBottom bold>
                **Cliente retirará**
              </PrintTypography>
            )}

            {order.shipment.scheduled_at && (
              <PrintTypography gutterBottom bold>
                **Cliente retirará ás {order.shipment.formattedScheduledAt}**
              </PrintTypography>
            )}

            {order.board_movement && (
              <PrintTypography bold>**Mesa {order.board_movement?.board?.number}**</PrintTypography>
            )}

            <div className={classes.customerData}>
              <PrintTypography>Cliente</PrintTypography>
              <PrintTypography>{order.customer.name}</PrintTypography>
            </div>
            <div className={classes.customerData}>
              <PrintTypography>Telefone</PrintTypography>
              <PrintTypography>{order.customer.phone}</PrintTypography>
            </div>
            {order.shipment.shipment_method === 'delivery' && (
              <div className={classes.customerData}>
                <PrintTypography>Endereço</PrintTypography>
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
                        {product.annotation && (
                          <PrintTypography fontSize={0.8}>Obs: {product.annotation}</PrintTypography>
                        )}
                        <div className={classes.additionalInfoContainer}>
                          {product.additional.length > 0 && (
                            <>
                              {product.additional.map(additional => (
                                <PrintTypography display="inline" className={classes.additional} key={additional.id}>
                                  {`c/ ${additional.amount}x ${additional.name}`}
                                </PrintTypography>
                              ))}
                            </>
                          )}
                          {product.ingredients.length > 0 && (
                            <>
                              {product.ingredients.map(ingredient => (
                                <PrintTypography display="inline" className={classes.ingredient} key={ingredient.id}>
                                  {`s/ ${ingredient.name}`}
                                </PrintTypography>
                              ))}
                            </>
                          )}
                        </div>
                        {product.complement_categories.length > 0 && (
                          <>
                            {product.complement_categories.map(category => (
                              <Fragment key={category.id}>
                                {category.complements.length > 0 && (
                                  <div className={classes.complementCategory}>
                                    <PrintTypography italic>{category.print_name || category.name}</PrintTypography>
                                    <Complements complementCategory={category} />
                                  </div>
                                )}
                              </Fragment>
                            ))}
                          </>
                        )}
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
              <div>
                <PrintTypography>{order.payment_method.method}</PrintTypography>
              </div>
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
                <PrintTypography>Total a pagar</PrintTypography>
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
            <div className={classes.developer}>
              <PrintTypography fontSize={0.9} align="center">
                www.sgrande.delivery
              </PrintTypography>
            </div>
          </div>
        ))}
    </>
  );
};

export default PrintOnlyShipment;
