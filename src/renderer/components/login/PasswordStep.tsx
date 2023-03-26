import React, { ChangeEvent } from 'react';
import { TextField, Typography, IconButton, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MdArrowBack, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const useStyles = makeStyles({
  action: {
    //
  },
  arrowBackIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  inputContainer: {
    margin: '30px 0 60px',
  },
});

interface PasswordStepProps {
  login: {
    name: string;
    email: string;
    password: string;
  };
  handleChange(e: ChangeEvent<HTMLInputElement>): void;
  loading: boolean;
  shownPassword: boolean;
  handlePasswordVisibility(): void;
  handleStepBack(): void;
}

const PasswordStep: React.FC<PasswordStepProps> = ({
  login,
  handleChange,
  handleStepBack,
  shownPassword,
  handlePasswordVisibility,
  loading,
}) => {
  const classes = useStyles();

  return (
    <>
      <IconButton color="primary" className={classes.arrowBackIcon} onClick={handleStepBack}>
        <MdArrowBack />
      </IconButton>
      <Typography align="center" color="primary">
        Seja bem-vindo {login.name}.
      </Typography>
      <div className={classes.inputContainer}>
        <TextField
          margin="normal"
          label="Senha"
          placeholder="Informe sua senha"
          fullWidth
          value={login.password}
          onChange={loading ? undefined : handleChange}
          name="password"
          type={shownPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handlePasswordVisibility}>
                  {shownPassword ? <MdVisibilityOff size={20} color="#666" /> : <MdVisibility size={20} color="#666" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoFocus
        />
      </div>
      <input type="hidden" autoComplete="email username" name="username" value={login.email} />
    </>
  );
};

export default PasswordStep;
