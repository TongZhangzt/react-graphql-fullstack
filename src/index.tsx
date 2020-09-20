import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';

import Router from './pages/router';
import store from './store';
import { client } from './api';
import { loginAction } from './store/actions';
import { getLoggedInUser } from './api/schema';
import 'antd/dist/antd.css';
import './index.scss';

const renderDOM = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  );
};

// check whether there is logged in user when init data store
if (
  document.cookie &&
  document.cookie.includes('session_expire') &&
  parseInt(document.cookie.replace('session_expire=', '')) >
    new Date().getTime()
) {
  client
    .query({
      query: getLoggedInUser,
    })
    .then(res => {
      if (res && res.data && res.data.LoggedInUser) {
        store.dispatch(loginAction(res.data.LoggedInUser));
      }
      renderDOM();
    })
    .catch(error => {
      renderDOM();
    });
} else {
  renderDOM();
}
