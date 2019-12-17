import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navigation from "./components/UIElements/navigation";
import AuthContext from "./components/session";
import { firebaseConfig } from "./components/firebase/config";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#000000",
        dark: "#000000",
        contrastText: "#fff",
      }
    }
  });
  function readSession() {
    const user = window.sessionStorage.getItem(
      `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
    );
    if (user) setLoggedIn(true);
  }
  useEffect(() => {
    readSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Navigation title="OOO" isLoggedIn={isLoggedIn} />
        </Router>
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
