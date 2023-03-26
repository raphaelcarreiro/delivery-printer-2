import React from 'react';
import { CircularProgress, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    marginTop: 15,
  },
});

const InsideLoading: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="textSecondary" className={classes.message}>
          Carregando
        </Typography>
      </div>
    </>
  );
};

export default InsideLoading;
