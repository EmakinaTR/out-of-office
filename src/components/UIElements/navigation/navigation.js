import React, { useContext } from "react";
import protectedRoutes from "../../../constants/routes";
import { Switch, Link, BrowserRouter as Router } from "react-router-dom";
import AuthContext from "../../session";
import SignIn from "../../../pages/signin";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { FirebaseContext } from "../../firebase";
import ProtectedRouteHoc from "../../protectedRouteHoc";
import { withRouter, useHistory } from "react-router-dom";
import LaunchScreen from "../launchScreen/LaunchScreen";
const drawerWidth = 240;
const Navigation = props => {
  const { isLoggedIn } = useContext(AuthContext);
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const _getCurrentRouteIndex = location => {
    let activeIndex = protectedRoutes.findIndex(route => {
      return route.path === location;
    });
    // If active index could not be found, it means default route path is used. Then, set active index to default value (0).
    return activeIndex < 0 ? 0 : activeIndex;
  };
  // Handle history changes
  history.listen(() => {
    const activeIndex = _getCurrentRouteIndex(history.location.pathname);
    setSelectedIndex(activeIndex);
  });

  const signOut = () => {
    firebase.auth.signOut();
  };
  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 101
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    title: {
      flex: 1,
      textAlign: "center",
      [theme.breakpoints.up("sm")]: {
        textAlign: "left"
      }
    },
    avatar: {},
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      backgroundColor: "#e8e8e8",
      minHeight: "94.8vh"
    },
    toolbar: theme.mixins.toolbar
  }));
  const theme = useTheme();
  const classes = useStyles();
  const Auth = useContext(AuthContext);
  const user = Auth.readSession();
  /*
    States:
    mobileOpen state is controlled by Menu Button to toggle drawer
    selectedIndex state indicates the active route
  */
  const activeIndex = _getCurrentRouteIndex(props.location.pathname);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(activeIndex);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const _onListItemClick = index => {
    setSelectedIndex(index);
    setMobileOpen(false);
  };
  return (
    <div className={classes.root}>
      <Router>
        {/* AppBar */}
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {props.title}
            </Typography>
            {/* <Avatar className={classes.avatar}>{props.avatarText}</Avatar> */}
            <Avatar src={user?.photoURL}></Avatar>
          </Toolbar>
        </AppBar>
        {/* Side Nav Bar */}
        {isLoggedIn ? (
          <Drawer
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper
            }}
            variant={matches ? "permanent" : "temporary"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
          >
            <div className={classes.toolbar} />

            <List>
              {protectedRoutes.map((route, index) => {
                // Render List ONLY IF the route has a name. It prevents default route to be printed.
                if (route.name) {
                  return (
                    <ListItem
                      component={Link}
                      to={route.path}
                      onClick={() => _onListItemClick(index)}
                      button
                      key={index}
                      selected={index === selectedIndex}
                    >
                      <ListItemIcon>
                        <Icon>{route.icon}</Icon>
                      </ListItemIcon>
                      <ListItemText primary={route.name} />
                    </ListItem>
                  );
                }
              })}
            </List>
          </Drawer>
        ) : (
          <LaunchScreen></LaunchScreen>
        )}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            {protectedRoutes.map(route => (
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
        </main>
      </Router>
    </div>
  );
};

export default withRouter(Navigation);
