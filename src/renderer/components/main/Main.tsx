import React from 'react';
import { useAuth } from 'renderer/providers/auth';
import Status from '../status/Status';
import { history } from 'renderer/services/history';
import { useSocket } from 'renderer/hooks/useSocket';
import InsideLoading from '../loading/InsideLoading';
import { usePrintingOrder } from 'renderer/hooks/usePrintingOrder';
import { usePrintingBoard } from 'renderer/hooks/usePrintingBoard';

const Home: React.FC = () => {
  const auth = useAuth();

  const [socket, wsConnected] = useSocket();

  usePrintingOrder(socket);
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
      <Status wsConnected={wsConnected} handleLogout={handleLogout} />
    </>
  );
};

export default Home;
