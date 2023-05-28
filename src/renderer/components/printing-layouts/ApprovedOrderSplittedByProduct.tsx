import React, { useEffect, useState, Fragment, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { OrderData, ProductPrinterData } from 'renderer/types/order';
import { api } from 'renderer/services/api';
import { Theme } from '@material-ui/core';
import { useSelector } from 'renderer/store/selector';
import PrintTypography from '../../base/print-typography/PrintTypography';
import Address from './shared-parts/Address';
import Additional from './shared-parts/Additional';
import Ingredients from './shared-parts/Ingredients';
import ComplementCategories from './shared-parts/ComplementCategories';
import { useSetOrderPrinted } from 'renderer/hooks/useSetOrderPrinted';

interface UseStylesProps {
  fontSize: number;
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
        padding: '0 0 0 10px',
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
    display: 'flex',
    flexWrap: 'wrap',
  },
});

interface ApprovedOrderSplittedByProductProps {
  handleClose(): void;
  data: OrderData;
}

const ApprovedOrderSplittedByProduct: React.FC<ApprovedOrderSplittedByProductProps> = ({ handleClose, data }) => {
  const restaurant = useSelector(state => state.restaurant);
  const order = useMemo(() => JSON.parse(JSON.stringify(data)), [data]);
  const classes = useStyles({
    fontSize: restaurant?.printer_settings.font_size || 14,
  });

  const [products, setProducts] = useState<ProductPrinterData[]>([]);
  const [toPrint, setToPrint] = useState<ProductPrinterData[]>([]);
  const { setOrderAsPrinted } = useSetOrderPrinted(handleClose, order.id);

  // close if there is not printer in product
  useEffect(() => {
    const check = order.products.some(product => product.printer);

    if (!check) {
      setOrderAsPrinted();
    }
  }, [setOrderAsPrinted, order]);

  // get product printers
  useEffect(() => {
    if (!order) return;

    let productsToPrint: ProductPrinterData[] = [];
    order.products.forEach(product => {
      if (product.printer) {
        let i = 1;
        do {
          productsToPrint.push({
            id: `${product.id}-${i}`,
            productId: product.id,
            name: product.printer.name,
            order,
            printed: false,
            currentAmount: i,
          });
          i += 1;
        } while (i <= product.amount);
      }
    });

    productsToPrint = productsToPrint.map(productToPrint => {
      productToPrint.order = {
        ...order,
        products: order.products.filter(product => product.printer && product.id === productToPrint.productId),
      };
      productToPrint.printed = false;
      return productToPrint;
    });

    setProducts(productsToPrint);
  }, [order]);

  useEffect(() => {
    if (products.length > 0) {
      const tp = products.find(p => !p.printed);

      // close if all order products had been printed
      if (!tp) {
        const check = products.every(p => p.printed);
        if (check) setOrderAsPrinted();
        return;
      }

      setToPrint([tp]);
    }
  }, [products, setOrderAsPrinted, order]);

  // print
  useEffect(() => {
    if (!toPrint.length) {
      return;
    }

    const [printing] = toPrint;

    window.electron
      .print(printing.name)
      .then(() => {
        setProducts(oldValue =>
          oldValue.map(p => {
            if (p.id === printing.id) p.printed = true;
            return p;
          })
        );
      })
      .catch(err => {
        console.error(err);
        window.electron
          .print()
          .then(() => {
            setProducts(oldValue =>
              oldValue.map(p => {
                if (p.id === printing.id) p.printed = true;
                return p;
              })
            );
          })
          .catch(err => {
            console.error(err);
            handleClose();
          });
      });
  }, [toPrint, handleClose]);

  return (
    <>
      {toPrint.length > 0 &&
        toPrint.map(printer => (
          <div className={classes.container} key={printer.id}>
            <PrintTypography fontSize={1.2} bold gutterBottom>
              PEDIDO {order.formattedSequence}
            </PrintTypography>
            <PrintTypography>{order.formattedDate}</PrintTypography>
            <PrintTypography gutterBottom>{order.customer.name}</PrintTypography>
            {order.shipment.shipment_method === 'delivery' && <Address shipment={order.shipment} />}

            {order.shipment.shipment_method === 'customer_collect' && !order.shipment.scheduled_at && (
              <PrintTypography>**Cliente retirará**</PrintTypography>
            )}

            {order.shipment.scheduled_at && (
              <PrintTypography>**Cliente retirará ás {order.shipment.formattedScheduledAt}**</PrintTypography>
            )}

            {order.board_movement && (
              <PrintTypography bold>**Mesa {order.board_movement?.board?.number}**</PrintTypography>
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

export default ApprovedOrderSplittedByProduct;
