import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navigation from "./components/UIElements/navigation";
import AuthContext from "./components/session";
import { FirebaseContext } from "../src/components/firebase";
import useMediaQuery from "@material-ui/core/useMediaQuery";
function App(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const firebaseContext = useContext(FirebaseContext);
  const signIn = () => {
    firebaseContext.doSignInWithGoogle().then(result => {
      setLoggedIn(true);
    });
  };

  firebaseContext.auth.onAuthStateChanged(user => {
    window.currentUser = user;
    if (user) {
      setLoggedIn(true);
    } else {
      signIn();
    }
  });

  const breakpointValues = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  };
  let theme = createMuiTheme({
    palette: {
      primary: {
        main: "#212121",
        __TEST__: "#aaaaaa"
      },
      secondary: {
        main: "#008fd4"
      }
    },
    breakpoints: { values: breakpointValues }
  });

  const isLarge = useMediaQuery(theme.breakpoints.up("md"));
  const _spacing = theme.spacing;
  theme.spacing = value => {
    value = isLarge ? value : value * 1;
    return _spacing(value);
  };
  function readSession() {
    const user = window.currentUser;
    if (user) {
      return user;
    }
  }
  useEffect(() => {
    readSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, readSession }}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Navigation title="OOO" isLoggedIn={isLoggedIn}></Navigation>
        </Router>
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
