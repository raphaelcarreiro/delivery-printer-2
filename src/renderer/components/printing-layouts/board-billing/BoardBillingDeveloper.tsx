import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';

const styles = makeStyles<Theme>({
  developer: {
    marginTop: 15,
  },
});

const BoardBillingDeveloper: React.FC = () => {
  const classes = styles();

  return (
    <div className={classes.developer}>
      <PrintTypography fontSize={0.9} align="center">
        www.sgrande.delivery
      </PrintTypography>
    </div>
  );
};

export default BoardBillingDeveloper;
