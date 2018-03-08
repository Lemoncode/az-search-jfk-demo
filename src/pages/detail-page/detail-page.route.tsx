import * as React from 'react';
import { Route } from 'react-router';
import { DetailPageContainer } from './detail-page.container';

export const detailPath = "/detail";

export const DetailRoute = (
  <Route path={detailPath} component={DetailPageContainer} />
);