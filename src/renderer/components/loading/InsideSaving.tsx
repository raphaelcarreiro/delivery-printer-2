import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1400,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.5)',
  },
  circularProgress: {
    top: '25%',
    position: 'absolute',
  },
});

const InsideSaving: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.loading}>
      <CircularProgress color="primary" />
    </div>
  );
};

export default InsideSaving;
