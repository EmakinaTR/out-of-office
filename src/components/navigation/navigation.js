import React, { useContext } from "react";
import protectedRoutes from "../../constants/routes";
import { Switch, Link, BrowserRouter as Router } from "react-router-dom";
import AuthContext  from "../session";
import SignIn from "../../pages/signin";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {FirebaseContext} from '../../components/firebase'
import routes from "../../constants/routes";
import ProtectedRouteHoc from "../protectedRouteHoc";

const drawerWidth = 240;
const Navigation = props => {
  const { isLoggedIn } = useContext(AuthContext);
  const firebase = useContext(FirebaseContext);
  const signOut = () => {
    firebase.auth.signOut();
  }
  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 101,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    title: {
      flex: 1,
      textAlign: "center"
    },
    avatar: {

    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
  }));
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const matches = useMediaQuery('(min-width:800px)');
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
            <Avatar className={classes.avatar}>{props.avatarText}</Avatar>
          </Toolbar>
        </AppBar>
        {/* Side Nav Bar */}
        {isLoggedIn ?
        (<Drawer
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
            {protectedRoutes.map((route, index) => (
              <ListItem component={Link} to={route.path} button key={index}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>) : 
        <SignIn></SignIn>
        }
        <main className={classes.content}>
          <div className={classes.toolbar} />
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
          </main>
        </Router>
    </div>
  )
}


export default Navigation;
