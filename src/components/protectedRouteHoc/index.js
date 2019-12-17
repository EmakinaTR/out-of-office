import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
const ProtectedRouteHoc = ({ component: Component, isLoggedIn, ...rest }) => {
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
    return <Redirect to={{ pathname: '/' }} />;
};
export default withRouter(ProtectedRouteHoc);