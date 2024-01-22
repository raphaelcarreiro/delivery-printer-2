import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { OrderData, PrinterData } from 'renderer/types/order';
import { Theme } from '@material-ui/core';
import { useSelector } from 'renderer/store/selector';
import PrintTypography from '../../base/print-typography/PrintTypography';
import Header from './shared-parts/Header';
import Address from './shared-parts/Address';
import Additional from './shared-parts/Additional';
import Ingredients from './shared-parts/Ingredients';
import ComplementCategories from './shared-parts/ComplementCategories';
import { useSetOrderPrinted } from 'renderer/hooks/useSetOrderPrinted';

interface UseStylesProps {
  fontSize: number;
  noMargin: boolean;
  maxWidth: number;
  marginSize: number;
}

const useStyles = makeStyles<Theme, UseStylesProps>({
  container: props => ({
    maxWidth: `${props.maxWidth}mm`,
    width: '100%',
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
    // display: 'flex',
    flexWrap: 'wrap',
  },
});

interface DispatchedOrderOnlyProps {
  handleClose(): void;
  data: OrderData;
}

const DispatchedOrderOnly: React.FC<DispatchedOrderOnlyProps> = ({ handleClose, data }) => {
  const restaurant = useSelector(state => state.restaurant);
  const order = useMemo(() => JSON.parse(JSON.stringify(data)), [data]);
  const classes = useStyles({
    fontSize: restaurant?.printer_settings?.font_size || 14,
    noMargin: !!restaurant?.printer_settings?.no_margin,
    maxWidth: restaurant?.printer_settings?.max_width || 80,
    marginSize: restaurant?.printer_settings.margin_size ?? 15,
  });
  const [printers, setPrinters] = useState<PrinterData[]>([]);
  const [toPrint, setToPrint] = useState<PrinterData[]>([]);
  const [printedQuantity, setPrintedQuantity] = useState(0);
  const { setOrderAsPrinted } = useSetOrderPrinted(handleClose, order.id);

  const copies = useMemo(() => {
    return restaurant?.printer_settings.shipment_template_copies || 1;
  }, [restaurant]);

  // close if there is not printer in product
  useEffect(() => {
    const check = order.products.some(product => product.printer);

    if (!check) {
      setOrderAsPrinted();
    }
  }, [setOrderAsPrinted, order]);

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
    if (!printers.length) {
      return;
    }

    const tp = printers.find(printer => !printer.printed);

    if (tp) {
      setToPrint([tp]);
      setPrintedQuantity(0);
      return;
    }

    // close when all order products had been printed
    setOrderAsPrinted();
    setPrinters([]);
    setToPrint([]);
  }, [printers, setOrderAsPrinted]);

  // print
  useEffect(() => {
    if (!toPrint.length) return;

    const [printing] = toPrint;

    if (printedQuantity === copies) {
      setPrinters(state =>
        state.map(printer => {
          if (printer.id === printing.id) {
            printer.printed = true;
          }
          return printer;
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
            <Header formattedSequence={order.formattedSequence} shipment={order.shipment} />

            <PrintTypography gutterBottom>{order.formattedDate}</PrintTypography>

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
                          <Additional additional={product.additional} />
                          <Ingredients ingredients={product.ingredients} />
                        </div>

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
              <div>
                <PrintTypography>
                  {order.payment_method.mode === 'online' ? `Online` : order.payment_method.method}
                </PrintTypography>
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
                <PrintTypography>{order.payment_method.mode ? 'Total' : 'Total a pagar'}</PrintTypography>
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

export default DispatchedOrderOnly;
