import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const Navigation = props => {
  return (
    <div>
      {/* AppBar */}
      <AppBar className={classes.appbar}>
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
            {this.props.title}
          </Typography>
          <Avatar className={classes.avatar}>{this.props.avatarText}</Avatar>
        </Toolbar>
      </AppBar>
      {/* Side Nav Bar */}
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
          {[
            "Özet",
            "Yeni İzin Talebi",
            "İzinlerim",
            "Gelen Talepler",
            "Rapolar"
          ].map((text, index) => (
            <ListItem component={Link} to="/newrequest" button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

Navigation.propTypes = {
  title: PropTypes.string,
  avatarText: PropTypes.string,
  routeData: PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.number,
    icon: PropTypes.string
  })
};

Navigation.defaultProps = {
  // bla: 'test',
};

export default Navigation;
