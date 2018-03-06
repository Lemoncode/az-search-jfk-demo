import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { HomePageContainer } from './pages/home-page';
import { SearchPageContainer } from './pages/search-page';
import { Reboot } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';
import { theme } from "./app.theme";

const sassEntryPoint = require("./app.style.scss");

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Reboot/>
    <HashRouter>
      <Switch>
        <Route exact={true} path="/" component={HomePageContainer} />
        <Route path="/search" component={SearchPageContainer} />
      </Switch>
    </HashRouter>
  </MuiThemeProvider>
  , document.getElementById('app')
);
