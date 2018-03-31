import * as React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { HomeRoute } from './pages/home-page';
import { SearchRoute } from './pages/search-page';
import { DetailRoute } from './pages/detail-page';


export const AppRouter = () => (
  <HashRouter>
    <Switch>
      {HomeRoute}
      {SearchRoute}
      {DetailRoute}
    </Switch>
  </HashRouter>
);