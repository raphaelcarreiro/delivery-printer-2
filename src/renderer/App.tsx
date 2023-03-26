import React from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core';
import Routes from './routes/Routes';
import AuthProvider from './providers/auth';
import { theme } from './theme/theme';
import MessagingProvider from './providers/messaging';
import { store } from './store';
import { BrowserRouter } from './routes/BrowserRouter';
import { history } from './services/history';
import './app.css';

const App: React.FC = () => (
  <BrowserRouter history={history}>
    <Provider store={store}>
      <AuthProvider>
        <MuiThemeProvider theme={theme}>
          <MessagingProvider>
            <Routes />
          </MessagingProvider>
        </MuiThemeProvider>
      </AuthProvider>
    </Provider>
  </BrowserRouter>
);

export default App;
