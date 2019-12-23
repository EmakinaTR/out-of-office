import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Avatar,
  Typography,
  makeStyles,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Fab
} from "@material-ui/core";

import DateFull from "../date/DateFull";
import CustomBadge from "../customBadge/CustomBadge";
import CheckIcon from "@material-ui/icons/Check";
const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  userInfoInner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "left",
    [theme.breakpoints.up("md")]: {
      alignItems: "center"
    }
  },
  avatarImage: {
    display: "none",
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "bold",
    [theme.breakpoints.up("md")]: {
      justifyContent: "center",
      marginLeft: theme.spacing(0),
      fontWeight: "bold"
    }
  },
  dividerContainer: {
    marginTop: theme.spacing(2.5)
  },
  leftContent: {
    display: "flex",
    alignItems: "center"
  },
  middleContent: {
    display: "flex",
    alignItems: "center"
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.up("lg")]: {
      justifyContent: "center"
    }
  },
  badgeContainer: {
    textAlign: "left",
    marginTop: theme.spacing(1),
    justifyContent: "flex-start",
    display: "flex",
    [theme.breakpoints.up("md")]: {
      justifyContent: "center"
    }
  },
  leavePeriod: {
    textAlign: "left",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      textAlign: "center"
    }
  }
}));
const RequestedLeaveItem = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Grid className={classes.container} container alignItems="center">
      {/* avatar - username  */}
      <Grid item xs={12} md={2} className={classes.leftContent}>
        <Grid container className={classes.userInfoInner}>
          <Grid item className={classes.userInfo}>
            <Avatar className={classes.avatarImage}>
              {props.userName?.charAt(0)}
            </Avatar>
            <Typography className={classes.userName}>
              {props.userName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10} md={8}>
        <Grid container>
          <Grid item xs={12}>
            <DateFull
              justifycontent={isLargeScreen ? "center" : "flex-start"}
              className={classes.dateFull}
              startDate={props.startDate}
              endDate={props.endDate}
            ></DateFull>
          </Grid>
          <Grid className={classes.badgeContainer} item xs={12}>
            <CustomBadge
              marginright="0.5rem"
              badgecolor={props.statusTypeColor}
            >
              {props.statusTypeContent}
            </CustomBadge>

            <CustomBadge marginright="0.5rem" backgroundColor="blue">
              {props.dayCount + " gün"}
            </CustomBadge>

            <CustomBadge badgecolor={props.leaveTypeColor}>
              {props.leaveTypeContent}
            </CustomBadge>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} md={2}>
        <Fab size="small">
          <CheckIcon htmlColor="green"></CheckIcon>
        </Fab>
      </Grid>
      {/* Divider */}
      <Grid item xs={12}>
        <Divider className={classes.dividerContainer}></Divider>
      </Grid>
    </Grid>
  );
};

RequestedLeaveItem.propTypes = {
  userName: PropTypes.string
};

export default RequestedLeaveItem;
