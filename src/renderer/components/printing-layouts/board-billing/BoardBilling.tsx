import { Theme, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { BoardControlMovement } from 'renderer/types/boardControlMovement';
import PrintTypography from '../../../base/print-typography/PrintTypography';
import BoardBillingProducts from './BoardBillingProducts';
import BoardBillingTotal from './BoardBillingTotal';
import BoardBillingDeveloper from './BoardBillingDeveloper';
import { useSelector } from 'renderer/store/selector';
import { moneyFormat } from 'renderer/helpers/NumberFormat';

interface UseStylesProps {
  fontSize: number;
  noMargin: boolean;
}

const styles = makeStyles<Theme, UseStylesProps>({
  container: props => ({
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
        padding: props.noMargin ? '0 0 0 0' : '0 0 0 10px',
        marginRight: 30,
      },
    },
  }),
  annotation: {
    marginLeft: 10,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerData: {
    display: 'grid',
    gridTemplateColumns: '75px 1fr',
    marginBottom: 2,
    columnGap: 7,
  },
  header: {
    borderBottom: '1px dashed #000',
    marginBottom: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
});

interface BoardBilingProps {
  movement: BoardControlMovement | null;
  handleClose(): void;
}

const BoardBilling: React.FC<BoardBilingProps> = ({ movement, handleClose }) => {
  const restaurant = useSelector(state => state.restaurant);
  const classes = styles({
    fontSize: 12,
    // fontSize: restaurant?.printer_settings?.font_size || 14,
    noMargin: !!restaurant?.printer_settings?.no_margin,
  });
  const formattedTotal = moneyFormat(movement?.total ?? 0);
  const formattedDiscount = moneyFormat(movement?.total ?? 0);
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    if (printed) {
      handleClose();
      return;
    }

    window.electron
      .print()
      .then(() => {
        setPrinted(true);
      })
      .catch(err => {
        console.error(err);
        handleClose();
      });
  }, [printed, handleClose]);

  return (
    <>
      {movement && !printed && (
        <div className={classes.container}>
          <div className={classes.header}>
            <PrintTypography fontSize={1.2} bold>
              CONTA - MESA {movement.board.number}
            </PrintTypography>
          </div>

          <PrintTypography gutterBottom>{movement.formattedCreatedAt}</PrintTypography>

          <div className={classes.customerData}>
            <PrintTypography noWrap>Cliente</PrintTypography>
            <PrintTypography>{movement.customer.name}</PrintTypography>
          </div>

          <BoardBillingProducts products={movement?.products ?? []} />

          <BoardBillingTotal
            formattedTotal={formattedTotal}
            formattedDiscount={formattedDiscount}
            discount={movement.discount ?? 0}
          />

          <BoardBillingDeveloper />
        </div>
      )}
    </>
  );
};

export default BoardBilling;
