import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { route } from '../../config';
import checkLoginStatus from '../../util/checkLoginStatus';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      checkLoginStatus() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: route.LOGIN_ROUTE ,
          }}
        />
      )
    }
  />
);

export default PrivateRoute;