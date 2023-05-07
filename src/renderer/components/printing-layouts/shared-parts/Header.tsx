import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';
import { Shipment } from 'renderer/types/order';

const useStyles = makeStyles({
  header: {
    textAlign: 'center',
    borderBottom: '1px dashed #000',
    paddingBottom: 10,
    marginBottom: 10,
  },
});

interface HeaderProps {
  shipment: Shipment;
  formattedSequence: string;
}

const Header: FC<HeaderProps> = ({ shipment, formattedSequence }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.header}>
        {shipment.shipment_method === 'customer_collect' && !shipment.scheduled_at && (
          <PrintTypography bold fontSize={1.2}>
            RETIRADA
          </PrintTypography>
        )}

        {shipment.scheduled_at && (
          <PrintTypography bold fontSize={1.2}>
            RETIRADA ÀS {shipment.formattedScheduledAt}
          </PrintTypography>
        )}

        {shipment.shipment_method === 'delivery' && !shipment.scheduled_at && (
          <PrintTypography bold fontSize={1.2}>
            ENTREGA
          </PrintTypography>
        )}
      </div>

      <PrintTypography bold gutterBottom>
        PEDIDO {formattedSequence}
      </PrintTypography>
    </>
  );
};

export default Header;
