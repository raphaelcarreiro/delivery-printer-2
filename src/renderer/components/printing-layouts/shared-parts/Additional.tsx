import React from 'react';
import { Additional as AdditionalType } from 'renderer/types/order';
import PrintTypography from '../../../base/print-typography/PrintTypography';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
  additional: {
    marginRight: 6,
  },
});

interface AdditionalProps {
  additional: AdditionalType[];
}

const amountMappings = {
  1: 'c/',
  2: 'c/ duplo',
  3: 'c/ triplo',
};

const Additional: React.FC<AdditionalProps> = ({ additional }) => {
  const classes = styles();

  function getAddionalAmountText(item: AdditionalType) {
    return amountMappings[item.amount] ?? `c/ ${item.amount}x`;
  }

  return (
    <>
      {additional.length > 0 && (
        <>
          {additional.map(additional => (
            <PrintTypography display="inline" className={classes.additional} key={additional.id}>
              {`${getAddionalAmountText(additional)} ${additional.name}`}
            </PrintTypography>
          ))}
        </>
      )}
    </>
  );
};

export default Additional;
