import React, { useContext } from "react";
import AuthContext from "../../components/session";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles(theme => ({
  container: {
    height: "100vh",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  redirectButton: {
    marginTop: "2rem"
  }
}));

const ErrorBoundary = props => {
  const { hasError, setHasError } = useContext(AuthContext);
  const classes = useStyles();
  const history = useHistory();
  const onButtonClick = () => {
    setHasError(false);
    history.push({
      pathname: "/",     
    });
  }
  if (hasError) {
    return (
      <div className={classes.container}>
        <Typography color="error" variant="h3">
          Unexpected Error :(
        </Typography>
        <Button onClick={onButtonClick} color="primary" variant="contained" className={classes.redirectButton}>Redirect To Dashboard Page</Button>
      </div>
    );
  } else {
    return props.children;
  }
};

export default ErrorBoundary;
