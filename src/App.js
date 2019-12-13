import React from "react";
import "./App.css";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";

function App() {
  // Create Custom Theme
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#000000",
        dark: "#002884",
        contrastText: "#fff"
      }
    }
  });
  return (
    // Pass custom theme to application using theme provider
    <MuiThemeProvider theme={theme}>
      <Router>
        <Navigation></Navigation>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
