import React from 'react';
import { Ingredient as IngredientType } from 'renderer/types/order';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';
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

  function getIngredientsText(ingredients: IngredientType[]) {
    return ingredients.map(ingredient => `s/ ${ingredient.name}`).join(' ');
  }

  return (
    <>
      {ingredients.length > 0 && (
        <PrintTypography display="inline" className={classes.text}>
          {getIngredientsText(ingredients)}
        </PrintTypography>
      )}
    </>
  );
};

export default Ingredients;
