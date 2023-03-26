import React from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useMessaging, Options, CallbackFunction } from 'renderer/providers/messaging';

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: '#28a745',
  },
  error: {
    backgroundColor: '#dc3545',
  },
  warning: {
    backgroundColor: '#ffc107',
  },
  info: {
    backgroundColor: '#17a2b8',
  },
  primary: {
    backgroundColor: '#007bff',
  },
  message: {
    marginLeft: 10,
    paddingTop: 3,
  },
  messageContent: {
    display: 'flex',
  },
  snackbar: {
    bottom: 10,
  },
  warningText: {
    color: '#ffc107',
  },
  actionText: {
    color: theme.palette.primary.light,
  },
}));

interface MessagingProps {
  message: string;
  options: Options | null;
  action: CallbackFunction | null;
  handleAction(): void;
  open: boolean;
}

const Messaging: React.FC<MessagingProps> = ({ message, options, action, handleAction, open }) => {
  const classes = useStyles();
  const messaging = useMessaging();

  return (
    <Snackbar
      style={options || undefined}
      classes={{
        anchorOriginBottomCenter: classes.snackbar,
      }}
      open={open}
      onClose={messaging.handleClose}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <SnackbarContent
        message={
          <div className={classes.messageContent}>
            <span className={classes.message}>{message}</span>
          </div>
        }
        action={
          action ? (
            <Button classes={{ root: classes.actionText }} size="small" onClick={handleAction}>
              Desfazer
            </Button>
          ) : (
            <Button size="small" classes={{ root: classes.actionText }} onClick={messaging.handleClose}>
              Fechar
            </Button>
          )
        }
      />
    </Snackbar>
  );
};

export default Messaging;
