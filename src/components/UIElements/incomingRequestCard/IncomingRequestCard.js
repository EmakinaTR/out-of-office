import React, { useContext} from "react";
import {
  Paper,
  Avatar,
  Grid,
  Typography,
  Box,
  Hidden,
  Chip,

} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateFull from "../date/DateFull";
import moment from "moment";
import "moment/locale/tr";
import MoreDialog from "../moreDialog";
import { FirebaseContext } from "../../firebase";
import AuthContext from "../../session";
import { useHistory } from "react-router-dom";
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
  const { currentUser } = useContext(AuthContext);
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
            <Grid item xs={11} lg={11}>
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
                            label={props.duration + " day"}
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
            <Grid item xs={1} lg={1} align="right">
              {/* <IconButton color="primary" aria-label="Approve" component="span">
            <CheckIcon></CheckIcon>
          </IconButton> */}
              <Box>
                <MoreDialog
                  from="IncomingRequest"
                  isFormOwner={props.createdBy === currentUser.uid}
                  leaveHasntBegin={new Date(props.startDate) >=new Date()}
                  currentUserRole ={currentUser.ROLE}
                  changeFormStatusHandler={props.changeFormStatusHandler}
                  detailHandler={detailHandler}
                  document={props.documentID}
                  requestStatus={props.requestStatus}
                ></MoreDialog>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
    </Box>
  );
};
