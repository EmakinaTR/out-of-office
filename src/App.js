import React, { useState, useEffect } from "react";
import './App.css';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navigation from './components/navigation';
import AuthContext  from './components/session';
import { firebaseConfig }from './components/firebase/config'




function App (){
  const [isLoggedIn, setLoggedIn] = useState(true);
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#000000",
        dark: "#002884",
        contrastText: "#fff"
      },
      mycolor: {
        light: "#0be300",
        main: "#0be300",
        dark: "#0be300",
        contrastText: "#fff"
      }
    }
  });
  function readSession() {
    const user = window.sessionStorage.getItem(
      `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
    );
    if (user) setLoggedIn(true)
    console.log(user);
  }
  useEffect(() => {
    readSession()
  }, [])
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
        <MuiThemeProvider theme={theme}>
            <Navigation title="OOO" avatarText="D" isLoggedIn={isLoggedIn}/>
        </MuiThemeProvider>
      </AuthContext.Provider>
    );
}

export default App;
