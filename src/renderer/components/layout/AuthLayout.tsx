import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    transitionDuration: '225ms',
    paddingLeft: 0,
    overflowY: 'auto',
    position: 'relative',
    paddingTop: 0,
  },
  content: {
    minHeight: 'calc(100vh)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
});

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div id="content-wrapper" className={classes.contentWrapper}>
        <div id="app-content" className={classes.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
