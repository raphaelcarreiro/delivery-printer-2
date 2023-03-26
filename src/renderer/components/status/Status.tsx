import React, { MouseEvent } from 'react';
import { makeStyles, Typography, Avatar } from '@material-ui/core';
import { useSelector } from 'renderer/store/selector';
import RestaurantStatus from 'renderer/components/restaurant-status/RestaurantStatus';
import packageJson from '../../../../package.json';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  formControl: {
    maxWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    '& div': {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    margin: '20px 0',
  },
  user: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 75,
    height: 'auto',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    marginRight: 10,
    border: `2px solid ${theme.palette.primary.main}`,
    height: 60,
    borderRadius: 30,
  },
  linkLogout: {
    cursor: 'pointer',
    color: theme.palette.error.main,
    marginTop: 2,
    display: 'inline-block',
    fontSize: 14,
  },
}));

interface StatusProps {
  wsConnected: boolean;
  handleLogout(): void;
}

const Status: React.FC<StatusProps> = ({ wsConnected, handleLogout }) => {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const user = useSelector(state => state.user);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    handleLogout();
  }

  return (
    <div className={classes.container}>
      <img className={classes.logo} src={restaurant?.image.imageUrl} alt="logo do restaurante" />
      <Typography variant="h4">{restaurant?.name}</Typography>
      <RestaurantStatus wsConnected={wsConnected} />
      {user.id && (
        <div className={classes.user}>
          {user.image ? (
            <img className={classes.avatar} src={user.image.imageUrl} alt="imagem do usuário" />
          ) : (
            <Avatar className={classes.avatar}>{user.name.charAt(0)}</Avatar>
          )}
          <div>
            <Typography variant="body2">{user.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>

            <a className={classes.linkLogout} onClick={handleClick}>
              desconectar
            </a>
          </div>
        </div>
      )}
      <div>
        <Typography>versão {packageJson.version}</Typography>
      </div>
    </div>
  );
};

export default Status;
