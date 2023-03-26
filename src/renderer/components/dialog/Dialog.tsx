import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: '#fff',
  },
});

interface DialogProps {
  children: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>{children}</div>
    </>
  );
};

export default Dialog;
