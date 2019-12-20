import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navigation from "./components/UIElements/navigation";
import AuthContext from "./components/session";
import { firebaseConfig } from "./components/firebase/config";
import useMediaQuery from "@material-ui/core/useMediaQuery";
function App() {
  const [isLoggedIn, setLoggedIn] = useState(true);
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
    value = isLarge ? value : value * 0.6;
    return _spacing(value);
  };
  function readSession() {
    const user = window.sessionStorage.getItem(
      `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
    );
    if (user) {
      setLoggedIn(true);
      return JSON.parse(user);
    }
    
  }
  useEffect(() => {
    readSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, readSession }}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Navigation title="OOO" isLoggedIn={isLoggedIn} />
        </Router>
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
