import React from 'react';
import { useAuth } from 'renderer/providers/auth';
import Status from '../status/Status';
import { history } from 'renderer/services/history';
import { useSocket } from 'renderer/hooks/useSocket';
import InsideLoading from '../loading/InsideLoading';
import { usePrintingOrder } from 'renderer/hooks/usePrintingOrder';
import { usePrintingBoard } from 'renderer/hooks/usePrintingBoard';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
  titleBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    background: 'white',
    userSelect: 'none',
    appRegion: 'drag',
    padding: '10px 0 0 18px',
    color: '#222',
    fontWeight: 300,
    fontSize: 14,
    gap: 7,
    '& > img': {
      width: 25,
      height: 25,
    },
  },
});

const Home: React.FC = () => {
  const classes = styles();
  const auth = useAuth();

  const [socket, wsConnected] = useSocket();

  usePrintingOrder(socket, wsConnected);
  usePrintingBoard(socket);

  function handleLogout() {
    auth.logout().then(() => {
      socket.disconnect();
      history.push('/login');
    });
  }

  if (auth.loading) {
    return <InsideLoading />;
  }

  return (
    <>
      <div className={classes.titleBar}>
        <span>sgrande delivery printer</span>
      </div>
      <Status wsConnected={wsConnected} handleLogout={handleLogout} />
    </>
  );
};

export default Home;
