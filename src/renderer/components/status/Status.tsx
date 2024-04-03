import React, { MouseEvent } from 'react';
import { makeStyles, Typography, Avatar, Theme } from '@material-ui/core';
import { useSelector } from 'renderer/store/selector';
import RestaurantStatus from 'renderer/components/restaurant-status/RestaurantStatus';
import packageJson from '../../../../package.json';

type UseStylesProps = {
  isConnected: boolean;
};

const useStyles = makeStyles<Theme, UseStylesProps>(theme => ({
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
  logo: props => ({
    width: 150,
    height: 150,
    marginBottom: 20,
    border: `2px solid ${props.isConnected ? theme.palette.success.main : theme.palette.error.main}`,
    borderRadius: '50%',
    padding: 5,
  }),
  avatar: {
    width: 60,
    marginRight: 10,
    border: `2px solid ${theme.palette.primary.main}`,
    height: 60,
    borderRadius: 30,
    objectFit: 'cover',
  },
  linkLogout: {
    cursor: 'pointer',
    color: theme.palette.error.main,
    marginTop: 2,
    display: 'inline-block',
    fontSize: 14,
  },
  logoContent: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
  },
  version: {
    borderTop: '1px solid #eee',
    width: 400,
    paddingTop: 15,
    textAlign: 'center',
  },
}));

interface StatusProps {
  wsConnected: boolean;
  handleLogout(): void;
}

const Status: React.FC<StatusProps> = ({ wsConnected, handleLogout }) => {
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles({ isConnected: !!restaurant?.is_open });
  const user = useSelector(state => state.user);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    handleLogout();
  }

  return (
    <div className={classes.container}>
      <div className={classes.logoContent}>
        <img className={classes.logo} src={restaurant?.image?.imageUrl} alt="logo do restaurante" />
        <div>
          <Typography variant="h4">{restaurant?.name}</Typography>
          <Typography variant="body1" color="textSecondary">
            {restaurant?.description}
          </Typography>
          <RestaurantStatus wsConnected={wsConnected} />
        </div>
      </div>
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
      <div className={classes.version}>
        <Typography variant="caption" color="textSecondary">
          v{packageJson.version} - ia32
        </Typography>
      </div>
    </div>
  );
};

export default Status;
