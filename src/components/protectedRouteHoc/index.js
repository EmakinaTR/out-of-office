import React from "react";
import { Route, Redirect, withRouter, useHistory } from "react-router-dom";
const ProtectedRouteHoc = ({ component: Component, isLoggedIn, onRouteChange, ...rest }) => {
  const history = useHistory();
  const location = history.location;
  onRouteChange(location);
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
