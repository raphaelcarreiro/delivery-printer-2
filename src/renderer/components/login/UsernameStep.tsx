import React, { ChangeEvent } from 'react';
import { TextField, Typography, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MdPerson } from 'react-icons/md';

const useStyles = makeStyles({
  inputContainer: {
    margin: '30px 0 60px',
  },
});

interface UserNameStepProps {
  email: string;
  handleChange(e: ChangeEvent<HTMLInputElement>): void;
  loading: boolean;
}

const UsernameStep: React.FC<UserNameStepProps> = ({ email, handleChange, loading }) => {
  const classes = useStyles();
  return (
    <>
      <Typography align="center" color="primary">
        Olá. Para iniciar, digite seu e-mail.
      </Typography>
      <div className={classes.inputContainer}>
        <TextField
          margin="normal"
          label="E-mail"
          placeholder="Digite o seu e-mail"
          fullWidth
          value={email}
          onChange={loading ? undefined : handleChange}
          name="email"
          type="email"
          required
          autoFocus
          autoComplete="email"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <MdPerson size={20} color="#666" />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </>
  );
};

export default UsernameStep;
