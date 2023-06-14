import React, { useEffect, useState, Fragment, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { OrderData, PrinterData } from 'renderer/types/order';
import { api } from 'renderer/services/api';
import { Theme } from '@material-ui/core';
import { useSelector } from 'renderer/store/selector';
import PrintTypography from '../../base/print-typography/PrintTypography';
import Additional from './shared-parts/Additional';
import Address from './shared-parts/Address';
import Ingredients from './shared-parts/Ingredients';
import ComplementCategories from './shared-parts/ComplementCategories';
import { useSetOrderPrinted } from 'renderer/hooks/useSetOrderPrinted';

interface UseStylesProps {
  fontSize: number;
  noMargin: boolean;
}

const useStyles = makeStyles<Theme, UseStylesProps>({
  container: props => ({
    maxWidth: '80mm',
    width: '100%',
    padding: '15px 15px 30px 15px',
    backgroundColor: '#faebd7',
    border: '2px dashed #ccc',
    fontSize: props.fontSize,
    '@media print': {
      '&': {
        backgroundColor: 'transparent',
        border: 'none',
        padding: props.noMargin ? '0 0 0 0' : '0 0 0 10px',
        marginRight: 0,
      },
    },
  }),
  products: {
    padding: '7px 0 0',
    borderTop: '1px dashed #333',
  },
  headerProducts: {
    marginTop: 7,
  },
  product: {
    width: '100%',
    paddingBottom: 10,
  },
  productAmount: {
    minWidth: 25,
    paddingBottom: 10,
    display: 'flex',
    paddingTop: 0,
  },
  additionalInfoContainer: {
    // display: 'flex',
    flexWrap: 'wrap',
    columnGap: 5,
  },
  header: {
    textAlign: 'center',
    borderBottom: '1px dashed #000',
    paddingBottom: 10,
    marginBottom: 10,
  },
});

interface ApprovedBoardOrderProps {
  handleClose(): void;
  data: OrderData;
}

const ApprovedBoardOrder: React.FC<ApprovedBoardOrderProps> = ({ handleClose, data }) => {
  const restaurant = useSelector(state => state.restaurant);
  const order = useMemo(() => JSON.parse(JSON.stringify(data)), [data]);
  const classes = useStyles({
    fontSize: restaurant?.printer_settings?.font_size || 14,
    noMargin: !!restaurant?.printer_settings?.no_margin,
  });

  const [printers, setPrinters] = useState<PrinterData[]>([]);
  const [toPrint, setToPrint] = useState<PrinterData[]>([]);
  const [printedQuantity, setPrintedQuantity] = useState(0);
  const { setOrderAsPrinted } = useSetOrderPrinted(handleClose, order.id);

  const copies = useMemo(() => {
    return restaurant?.printer_settings.production_template_copies || 1;
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
  }, [printers, setOrderAsPrinted, order]);

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
  }, [toPrint, handleClose, copies, printedQuantity]);

  return (
    <>
      {toPrint.length > 0 &&
        toPrint.map(printer => (
          <div className={classes.container} key={printer.id}>
            <div className={classes.header}>
              <PrintTypography fontSize={1.2} bold>
                MESA {order.board_movement?.board?.number}
              </PrintTypography>
            </div>

            <PrintTypography bold gutterBottom>
              PEDIDO {order.formattedSequence}
            </PrintTypography>

            <PrintTypography>{order.formattedDate}</PrintTypography>

            <PrintTypography gutterBottom>{order.customer.name}</PrintTypography>

            {order.shipment.shipment_method === 'delivery' && <Address shipment={order.shipment} />}

            {order.shipment.shipment_method === 'customer_collect' && !order.shipment.scheduled_at && (
              <PrintTypography bold>**Cliente retirará**</PrintTypography>
            )}

            {order.shipment.scheduled_at && (
              <PrintTypography>**Cliente retirará ás {order.shipment.formattedScheduledAt}**</PrintTypography>
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
                  {printer.order.products.map(product => (
                    <tr key={product.id}>
                      <td className={classes.productAmount}>
                        <PrintTypography>{product.amount}x</PrintTypography>
                      </td>

                      <td className={classes.product}>
                        <PrintTypography upperCase bold>
                          {product.name}
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
            <PrintTypography align="center">.</PrintTypography>
          </div>
        ))}
    </>
  );
};

export default ApprovedBoardOrder;
