import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';

const styles = makeStyles<Theme>({
  totals: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    rowGap: '4px',
    '& div': {
      display: 'flex',
      alignItems: 'center',
    },
  },
});

interface BoardBillingTotalProps {
  formattedDiscount: string;
  discount: number;
  formattedTotal: string;
}

const BoardBillingTotal: React.FC<BoardBillingTotalProps> = ({ discount, formattedDiscount, formattedTotal }) => {
  const classes = styles();

  return (
    <div className={classes.totals}>
      {discount > 0 && (
        <>
          <div>
            <PrintTypography>Desconto</PrintTypography>
          </div>
          <div>
            <PrintTypography>{formattedDiscount}</PrintTypography>
          </div>
        </>
      )}

      <div>
        <PrintTypography>Total a pagar</PrintTypography>
      </div>
      <div>
        <PrintTypography fontSize={1.2} bold>
          {formattedTotal}
        </PrintTypography>
      </div>
    </div>
  );
};

export default BoardBillingTotal;
