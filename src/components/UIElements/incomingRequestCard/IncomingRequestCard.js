import React, { useContext, useState, useEffect } from "react";
import {
  Paper,
  Avatar,
  Grid,
  Typography,
  Box,
  Hidden,
  Chip,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import CustomBadge from "../customBadge/CustomBadge";
import DateFull from "../date/DateFull";
import moment from "moment";
import "moment/locale/tr";
import MoreDialog from "../moreDialog";
import { FirebaseContext } from "../../firebase";
import { render } from "@testing-library/react";
import { Redirect, useHistory } from "react-router-dom";
moment().locale("tr");

const useStyles = makeStyles(theme => ({
  /*     request: {
        "& > *": {
          margin: theme.spacing(0.5),
          marginLeft: 0
        }
      }, */
  userName: {
    [theme.breakpoints.up("lg")]: {
      textAlign: "center"
    }
  },
  //   paper: {
  //     padding: theme.spacing(1),
  //     color: theme.palette.text.secondary,
  //     marginBottom: theme.spacing(2),
  //     display: "flex",
  //     alignItems: "center",

  //     [theme.breakpoints.up("sm")]: {
  //       padding: theme.spacing(2)
  //     },
  //     [theme.breakpoints.up("lg")]: {
  //       padding: theme.spacing(3)
  //     }
  //   },
  //   leftContent: {
  //     display: "flex",
  //     alignItems: "center"
  //   },
  //   middleContent: {
  //     display: "flex",
  //     alignItems: "center"
  //   },
  //   rightContent: {
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "flex-end",
  //     [theme.breakpoints.up("lg")]: {
  //       justifyContent: "center"
  //     }
  //   },
  //   userInfoInner: {
  //     display: "flex",
  //     flexDirection: "column",
  //     justifyContent: "flex-start",
  //     alignItems: "flex-start",
  //     textAlign: "left",
  //     [theme.breakpoints.up("md")]: {
  //       alignItems: "center"
  //     }
  //   },
  //   avatarImage: {
  //     display: "none",
  //     margin: "auto",
  //     marginBottom: "8px",
  //     [theme.breakpoints.up("md")]: {
  //       display: "flex"
  //     }
  //   },
  //   userName: {
  //     fontWeight: "bold",
  //     [theme.breakpoints.up("md")]: {
  //       justifyContent: "center",
  //       marginLeft: theme.spacing(0),
  //       fontWeight: "bold"
  //     }
  //   },

  //   moreButton: {
  //     backgroundColor: "transparent"
  //   },
  //   badgeContainer: {
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "flex-start",
  //     marginBottom: theme.spacing(1),
  //     [theme.breakpoints.up("xl")]: {
  //       marginBottom: theme.spacing(0),
  //       justifyContent: "center"
  //     }
  //   },
  //   leavePeriod: {
  //     textAlign: "left",
  //     marginBottom: theme.spacing(1),
  //     marginTop: theme.spacing(1),
  //     [theme.breakpoints.up("md")]: {
  //       textAlign: "center"
  //     }
  //   },
  //   description: {
  //     overflow: "hidden"
  //   }
}));

export const IncomingRequestCard = props => {
  const classes = useStyles();
  let history = useHistory();
  const firebaseContext = useContext(FirebaseContext);
  const detailHandler = document => {
    history.push({
      pathname: "/request-detail",
      search: "?formId=" + document
    });
  };
  return (
    <Box marginY={2}>
      <Paper>
        <Box padding={2}>
          <Grid container alignItems="center">
            <Grid item xs={10} lg={11}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} lg={2}>
                  <Hidden mdDown>
                    <Box marginY={0.5} align="center">
                      <Avatar>{props.userName?.charAt(0)}</Avatar>
                    </Box>
                  </Hidden>
                  <Typography className={classes.userName} noWrap>
                    {props.userName}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} xl={6}>
                      <DateFull
                        justifycontent="flex-start"
                        className={classes.dateFull}
                        startDate={props.startDate}
                        endDate={props.endDate}
                      ></DateFull>
                    </Grid>
                    <Grid item xl={6}>
                      <Box display="flex" justify="space-between">
                        <Box flexGrow={1}>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={props.duration + " gün"}
                            style={{ marginRight: ".5rem" }}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            style={{
                              borderColor: props.leaveTypeColor,
                              color: props.leaveTypeColor,
                              marginRight: ".5rem"
                            }}
                            label={props.leaveTypeContent}
                          />
                        </Box>
                        <Box>
                          <Chip
                            size="small"
                            style={{
                              backgroundColor: props.statusTypeColor,
                              color: "rgba(0,0,0,.7)"
                            }}
                            label={props.statusTypeContent}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    
                    {props.description ? (
                      <Grid item xs={12}>
                      <Typography className={classes.description} variant="body2">
                        {props.description}
                      </Typography>                 
                    </Grid>
                  ) : null}
                    
                  </Grid>
                  
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2} lg={1} align="right">
              {/* <IconButton color="primary" aria-label="Approve" component="span">
            <CheckIcon></CheckIcon>
          </IconButton> */}
              <Box>
                <MoreDialog
                  changeFormStatusHandler={props.changeFormStatusHandler}
                  detailHandler={detailHandler}
                  document={props.documentID}
                ></MoreDialog>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {/* <Paper className={classes.paper}>
        <Grid container>
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
          <Grid item xs={10} md={9} className={classes.middleContent}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Grid container className={classes.leavePeriod}>
                  <DateFull
                    className={classes.dateFull}
                    startDate={props?.startDate}
                    endDate={props?.endDate}
                  ></DateFull>
                </Grid>
              </Grid>
              <Grid
                item
                className={classes.badgeContainer}
                xs={5}
                sm={4}
                md={2}
                md={2}
              >
                <CustomBadge badgecolor={props.statusTypeColor}>
                  {" "}
                  {props.statusTypeContent}
                </CustomBadge>
              </Grid>
              <Grid
                item
                className={classes.badgeContainer}
                xs={3}
                sm={4}
                md={2}
                md={2}
              >
                <CustomBadge badgecolor="tomato">
                  {props.duration + " day"}
                </CustomBadge>
              </Grid>
              <Grid
                item
                className={classes.badgeContainer}
                xs={4}
                sm={4}
                md={2}
              >
                <CustomBadge badgecolor={props.leaveTypeColor}>
                  {props.leaveTypeContent}
                </CustomBadge>
              </Grid>
              <Grid item xs={12}>
                <Typography noWrap className={classes.description}>
                  {props.description}
                </Typography>
              </Grid>
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            md={1}
            justifyContent="center"
            className={classes.rightContent}
          >
            <MoreDialog
              changeFormStatusHandler={props.changeFormStatusHandler}
              detailHandler={detailHandler}
              document={props.documentID}
            ></MoreDialog>
          </Grid>
        </Grid>
      </Paper> */}
    </Box>
  );
};
