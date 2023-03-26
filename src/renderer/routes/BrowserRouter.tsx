import React, { useState } from 'react';
import { BrowserHistory, Action, Location } from 'history';
import { Router } from 'react-router-dom';

interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  history: BrowserHistory;
}

type BrowserRouterState = {
  action: Action;
  location: Location;
};

export const BrowserRouter: React.FC<BrowserRouterProps> = ({ history, children, basename }) => {
  const [state, setState] = useState<BrowserRouterState>({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router basename={basename} location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </Router>
  );
};
