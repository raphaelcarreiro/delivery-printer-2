import React from 'react';
import { Ingredient as IngredientType } from 'renderer/types/order';
import PrintTypography from '../../base/print-typography/PrintTypography';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
  text: {
    marginRight: 6,
  },
});

interface IngredientsProps {
  ingredients: IngredientType[];
}

const Ingredients: React.FC<IngredientsProps> = ({ ingredients }) => {
  const classes = styles();

  return (
    <>
      {ingredients.map(ingredient => (
        <PrintTypography display="inline" className={classes.text} key={ingredient.id}>
          {`s/ ${ingredient.name} `}
        </PrintTypography>
      ))}
    </>
  );
};

export default Ingredients;
