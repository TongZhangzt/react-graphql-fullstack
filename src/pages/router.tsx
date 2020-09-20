import * as React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { AuthComponent, NotFound } from '../components';
import Home from './Home/index';
import Login from './Login/index';
import User from './User/index';
import Post from './Post/index';
import AddPost from './Post/AddPost';
import Setting from './Setting/index';
import { UIRoute } from '../utils/types';

const routes: UIRoute[] = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    noAuth: true,
    noBackToTop: true,
  },
  {
    path: '/register',
    component: Login,
    noAuth: true,
  },
  {
    path: '/user/:id',
    component: User,
  },
  {
    path: '/post/:id',
    component: Post,
  },
  {
    path: '/writer',
    auth: true,
    component: AddPost,
  },
  {
    path: '/setting',
    auth: true,
    component: Setting,
  },
  {
    path: '*',
    component: NotFound,
  },
];

export default () => {
  return (
    <Router>
      <Switch>
        {routes.map(route => (
          <AuthComponent {...route} key={route.path} />
        ))}
      </Switch>
    </Router>
  );
};
