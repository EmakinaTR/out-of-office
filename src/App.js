import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navigation from "./components/UIElements/navigation";
import AuthContext from "./components/session";
import { firebaseConfig } from "./components/firebase/config";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const breakpointValues = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  };
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#000000",
        dark: "#000000",
        contrastText: "#fff",
      },
      secondary: {
        main: "#e0e0e0",
        dark: "#e0e0e0",
      }
    },
    breakpoints: {values:breakpointValues}
  });
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