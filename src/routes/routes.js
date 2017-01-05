import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import User from './Users/User.js';

const Routes = (
  <Route path="/" component={User} >
  </Route>
);

export default Routes;

