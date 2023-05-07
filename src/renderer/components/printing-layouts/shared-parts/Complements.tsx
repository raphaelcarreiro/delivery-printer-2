import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { ComplementCategory } from 'renderer/types/order';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';

const useStyles = makeStyles({
  ingredient: {
    marginRight: 6,
  },
});

interface ComplementProps {
  complementCategory: ComplementCategory;
}

const Complements: React.FC<ComplementProps> = ({ complementCategory }) => {
  const classes = useStyles();

  return (
    <div>
      {complementCategory.complements.map((complement, index) => (
        <div
          key={complement.id}
          style={
            complement.additional.length > 0 || complement.ingredients.length > 0
              ? { display: 'block' }
              : { display: 'inline-flex' }
          }
        >
          <PrintTypography display="inline">
            {complement.name}
            {index !== complementCategory.complements.length - 1 && ', '}
          </PrintTypography>
          <div>
            {complement.additional.map(additional => (
              <PrintTypography bold fontSize={0.8} display="inline" className={classes.ingredient} key={additional.id}>
                {`c/ ${additional.name}`}
              </PrintTypography>
            ))}
            {complement.ingredients.map(ingredient => (
              <PrintTypography bold fontSize={0.8} display="inline" className={classes.ingredient} key={ingredient.id}>
                {`s/ ${ingredient.name}`}
              </PrintTypography>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Complements;
