import React, { useState, useEffect } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Navigation from './components/navigation';
import AuthContext  from './components/session'
import routes from "./constants/routes";
import { firebaseConfig }from './components/firebase/config'
import ProtectedRouteHoc from "./components/protectedRouteHoc";

function App (){
  const [isLoggedIn, setLoggedIn] = useState(false);
  function readSession() {
    const user = window.sessionStorage.getItem(
      `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
    );
    if (user) setLoggedIn(true)
    console.log(user)
  }
  useEffect(() => {
    readSession()
  }, [])
    return (
      <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
        <Router >
          <Navigation isLoggedIn={isLoggedIn}/>
          <Switch>
            {routes.map(route => (
              <ProtectedRouteHoc
                key={route.path}
                isLoggedIn={isLoggedIn}
                path={route.path}
                component={route.main}
                exact={route.exact}
                public={route.public}
              />
            ))}
          </Switch>
        </Router>
      </AuthContext.Provider>
    );
}

export default App;
