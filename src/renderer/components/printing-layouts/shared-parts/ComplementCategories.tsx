import React, { FC, Fragment } from 'react';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';
import Complements from './Complements';
import { ComplementCategory } from 'renderer/types/order';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
  complementCategory: {
    display: 'grid',
    gridTemplateColumns: '0.7fr 1fr',
    gap: 10,
  },
});

interface ComplementCategoriesProps {
  categories: ComplementCategory[];
}

const ComplementCategories: FC<ComplementCategoriesProps> = ({ categories }) => {
  const classes = styles();

  return (
    <>
      {categories.map(category => (
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
  );
};

export default ComplementCategories;
