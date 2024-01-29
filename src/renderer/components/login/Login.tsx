import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from 'renderer/providers/auth';
import { useMessaging } from 'renderer/providers/messaging';
import { history } from 'renderer/services/history';
import InsideSaving from '../loading/InsideSaving';
import UsernameStep from './UsernameStep';
import PasswordStep from './PasswordStep';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: theme.palette.primary.light,
  },
  paper: {
    padding: '30px',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#fff',
    minWidth: 400,
    [theme.breakpoints.down('sm')]: {
      minWidth: 350,
    },
  },
  logo: {
    width: 90,
  },
  title: {
    margin: '30px 0 0',
  },
  footer: {
    marginTop: 30,
  },
}));

const Login: React.FC = () => {
  const classes = useStyles({
    src: '/images/background.jpg',
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [shownPassword, setShownPassword] = useState(false);
  const auth = useAuth();
  const messaging = useMessaging();

  useEffect(() => {
    setLoading(true);

    auth
      .me()
      .then(() => history.push('/'))
      .catch(() => setLoading(false));
  }, [auth]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 'email') {
      setLoading(true);

      auth
        .checkEmail(email)
        .then(response => {
          setName(response.name);
          setStep('password');
          messaging.handleClose();
        })
        .catch(err => {
          messaging.handleOpen(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);

      auth
        .login(email, password)
        .then(() => {
          setLoading(false);
          history.push('/');
        })
        .catch(err => {
          messaging.handleOpen(err.message);
          setLoading(false);
        });
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'email') setEmail(event.target.value);
    else setPassword(event.target.value);
  }

  function handleStepBack() {
    setStep('email');
  }

  function handlePasswordVisibility() {
    setShownPassword(!shownPassword);
  }

  return (
    <div className={classes.container}>
      <div className={classes.paper}>
        {loading && <InsideSaving />}
        <div>
          <img src="https://admin.sgrande.delivery/logo192.png" className={classes.logo} alt="Logo sgrande.delivery" />
        </div>
        <div className={classes.title}>
          <Typography variant="h6">Login</Typography>
        </div>
        <form onSubmit={handleSubmit} autoComplete="on">
          {step === 'email' ? (
            <UsernameStep handleChange={handleChange} email={email} loading={loading} />
          ) : (
            <PasswordStep
              handleChange={handleChange}
              login={{ email, password, name }}
              shownPassword={shownPassword}
              handleStepBack={handleStepBack}
              handlePasswordVisibility={handlePasswordVisibility}
              loading={loading}
            />
          )}
          <Button disabled={loading} type="submit" variant="contained" color="primary" fullWidth>
            {step === 'email' ? 'Próximo' : 'Entrar'}
          </Button>
        </form>
        <div className={classes.footer}>
          <Typography variant="body2" color="textSecondary">
            SGrande Delivery Printer 2023
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;
