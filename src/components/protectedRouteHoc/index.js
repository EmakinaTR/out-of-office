import React from "react";
import { Route, Redirect, withRouter, useHistory } from "react-router-dom";
const ProtectedRouteHoc = ({ component: Component, isLoggedIn, ...rest }) => {
  const history = useHistory();
  const location = history.location;
  if (isLoggedIn || rest.public) {
    return (
      <Route
        {...rest}
        render={props => {
          return <Component {...props}></Component>;
        }}
      />
    );
  }
  return <Redirect to={location} />;
};

export default withRouter(ProtectedRouteHoc);
