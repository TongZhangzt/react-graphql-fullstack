import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';

import store from '../../store';
import { BackToTop, NavHeader } from '../index';
import { UIRoute, User } from '../../utils/types';

export const AuthComponent: React.FunctionComponent<UIRoute> = ({
  ...route
}) => {
  const user: User = store.getState().user;

  // if the route need log in but haven't login, redirect to Login page
  if (route.auth && !user) {
    return <Redirect to="/login" />;
  }

  // if go to login page but the user has already logged in, redirect to home page
  if (route.noAuth && user) {
    return <Redirect to="/" />;
  }

  const isLoginOrRegister =
    route.path === '/login' || route.path === '/register';

  return (
    <>
      {!isLoginOrRegister && <NavHeader />}
      {!route.noBackToTop && <BackToTop />}
      <Route {...route} />
    </>
  );
};
