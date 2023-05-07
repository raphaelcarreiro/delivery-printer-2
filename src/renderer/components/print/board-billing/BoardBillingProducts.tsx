import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import { Product } from 'renderer/types/order';
import PrintTypography from 'renderer/components/print-typography/PrintTypography';
import OrderProductComplements from '../Complements';

const styles = makeStyles({
  products: {
    marginBottom: 15,
    padding: '5px 0 0',
    borderTop: '1px dashed #333',
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
  complementCategory: {
    display: 'grid',
    gridTemplateColumns: '0.5fr 1fr',
    alignItems: 'center',
  },
  headerProducts: {
    marginTop: 7,
  },
});

interface BoardBillingProductsProps {
  products: Product[];
}

const BoardBillingProducts: React.FC<BoardBillingProductsProps> = ({ products }) => {
  const classes = styles();

  return (
    <>
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
            {products.map(product => (
              <tr key={product.id}>
                <td className={classes.productAmount}>
                  <PrintTypography>{product.amount}x</PrintTypography>
                </td>
                <td className={classes.product}>
                  <PrintTypography upperCase bold>
                    {product.name} - {product.formattedFinalPrice}
                  </PrintTypography>
                  {product.complement_categories.length > 0 && (
                    <>
                      {product.complement_categories.map(category => (
                        <Fragment key={category.id}>
                          {category.complements.length > 0 && (
                            <div className={classes.complementCategory}>
                              <PrintTypography italic>{category.print_name || category.name}</PrintTypography>
                              <OrderProductComplements complementCategory={category} />
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
    </>
  );
};

export default BoardBillingProducts;
