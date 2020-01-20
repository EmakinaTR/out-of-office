import React, { useContext, useEffect, useState } from "react";
import InfoCard from "../../components/UIElements/InfoCard/InfoCard";
import {
  Container,
  Grid,
  Typography,
  Icon,
  Button,
  Box,
  Paper,
  Link,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Slide
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LeaveSummaryItem from "../../components/UIElements/LeaveSummaryItem/LeaveSummaryItem";
import { statusBadges, leaveBadges } from "../../constants/badgeTypes";
import IncomingRequestBasicCard from "../../components/UIElements/IncomingRequestBasicCard/IncomingRequestBasicCard";
import { FirebaseContext } from "../../components/firebase";
import AuthContext from "../../components/session";
import { ROLE } from "../../constants/roles";
import moment from "moment";
import { useHistory, withRouter } from "react-router-dom";
import SnackBar from "../../components/UIElements/snackBar/SnackBar";
import { snackbars } from "../../constants/snackbarContents";
import Alert from "@material-ui/lab/Alert";
import { getUserRole } from "../../constants/roles";
// String sources
const NEW_LEAVE_REQUEST = "New Leave Request";
const REMAINING_ANNUAL_LEAVE_REQUEST = "Remaining Annual Leave";
const REMAINING_CASUAL_LEAVE_REQUEST = "Remaining Excuse Leave";
const PENDING_LEAVE_REQUEST = "Pending Leave Requests";
const MY_LEAVE_REQUEST = "My Leaves";
const REQUESTED_LEAVES = "Incoming Requests";
const NO_INCOMING_REQUEST = "There is no incoming leave request";
const NO_MY_LEAVES_REQUEST = "There is no leave request";
const LIST_ITEM_COUNT = 5;

const useStyles = makeStyles(theme => ({
  newRequestButton: {
    width: "100%",
    padding: theme.spacing(2),
    paddingRight: "0.5rem",
    alignItems: "center",
    textTransform: "upperCase",
    minHeight: 75
  },
  newRequestButtonText: {
    flex: 1,
    textAlign: "left"
  }
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

let selectedIncomingRequest;
const Dashboard = props => {
  const classes = useStyles();
  const history = useHistory();
  const [snackbarState, setSnackbarState] = useState(false);
  const [snackbarType, setSnackbarType] = useState({});
  const [openMenu, setOpenMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const initialState = {
    processerDescription: "",
    statusType: undefined
  };
  const [state, setState] = useState(initialState);
  // Modal Handlers
  const closeDialog = () => {
    setOpenDialog(false);
  };

  const handleYesClick = () => {
    changeFormStatusHandler(
      selectedIncomingRequest.id,
      1,
      state.processerDescription
    );
    closeDialog();
  };

  const handleDescriptionChange = e => {
    setState({ ...state, processerDescription: e.target.value });
  };
  // My Request Detail Handler
  const detailHandler = document => {
    history.push({
      pathname: "/request-detail",
      search: "?formId=" + document
    });
  };
  // Incoming Request Approve Handler
  const onApproveButtonClick = document => {
    selectedIncomingRequest = document;
    setOpenDialog(true);
  };
  const changeFormStatusHandler = async (documentID, type, description) => {
    setIsLoading(true);
    await firebaseContext
      .setLeaveStatus(documentID, type, description)
      .then(() => {
        setSnackbarState(true);
        setSnackbarType(snackbars.success);
        _getIncomingRequest();
      })
      .catch(err => console.log(err));
    await firebaseContext
      .getCurrentUser(currentUser.uid)
      .then(async response => {
        const user = response.data();
        if (user) {
          user.role = getUserRole(user);
          user.uid = currentUser.uid;
          await setCurrentUser(user);
        }
      });
  };
  const { currentUser, setCurrentUser, setIsLoading, setHasError } = useContext(
    AuthContext
  );
  const firebaseContext = useContext(FirebaseContext);
  const [myRequests, setMyRequests] = useState([]);
  const [_incomingRequests, setIncomingRequests] = useState([]);
  const isAdmin = currentUser.role >= ROLE.APPROVER;

  const _getMyRequests = async () => {
    setIsLoading(true);
    await firebaseContext
      .getMyRequests({
        filterArray: [
          {
            fieldPath: "createdBy",
            condition: "==",
            value: currentUser.uid
          }
        ],
        pageSize: LIST_ITEM_COUNT
      })
      .then(result => {
        setMyRequests([...result.data]);
        setIsLoading(false);
      })
      .catch(error => {
        setHasError(true);
      });
  };

  const _getIncomingRequest = async () => {
    if (isAdmin) {
      setIsLoading(true);
      const filterArray = [
        {
          fieldPath: "status",
          condition: "==",
          value: 0
        }
      ];
      const queryData = {
        filterArray: filterArray,
        orderBy: { fieldPath: "requestedDate", type: "desc" },
        pageSize: LIST_ITEM_COUNT
      };
      await firebaseContext
        .getIncomingRequests(queryData)
        .then(result => {
          setIncomingRequests([...result.data]);
          setIsLoading(false);
        })
        .catch(error => {
          setHasError(true);
        });
    }
  };

  useEffect(() => {
    _getMyRequests();
    _getIncomingRequest();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box marginY={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Button
              href="/leaverequest"
              color="primary"
              variant="contained"
              className={classes.newRequestButton}
            >
              <Typography className={classes.newRequestButtonText}>
                {NEW_LEAVE_REQUEST}
              </Typography>
              <Icon fontSize="large">add</Icon>
            </Button>
          </Grid>
          {/* Remaining Annual Leave */}
          <Grid item xs={12} lg={6}>
            <InfoCard
              text={REMAINING_ANNUAL_LEAVE_REQUEST}
              count={currentUser.annualCredit}
              color="#008fd4"
            ></InfoCard>
          </Grid>
          {/* Remaining Pending Leave */}
          <Grid item xs={12} lg={6}>
            <InfoCard
              text={PENDING_LEAVE_REQUEST}
              count={1}
              color="#8cc63f"
            ></InfoCard>
          </Grid>
          {/* Remaining Casual Leave */}
          <Grid item xs={12} lg={6}>
            <InfoCard
              text={REMAINING_CASUAL_LEAVE_REQUEST}
              count={currentUser.excuseCredit}
              color="#ff7f41"
            ></InfoCard>
          </Grid>

          {/* Incoming Requests - Visible Only For Admin Users */}
          {isAdmin && (
            <Grid item xs={12} xl={6}>
              <Paper className={classes.listCard}>
                <Box padding={2} style={{ borderBottom: "solid 1px #ddd" }}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box fontWeight={500} fontSize="large">
                      {REQUESTED_LEAVES}
                    </Box>
                    {/* <IconButton color="primary" size="small" aria-label="Approve" component="span">
        <ChevronRightIcon />
        </IconButton> */}
                  </Box>
                </Box>
                <Box>
                  {_incomingRequests.length > 0 ? (
                    _incomingRequests.map((data, index) => {
                      return (
                        <div key={index}>
                          <IncomingRequestBasicCard
                            userName={data.requesterName}
                            documentId={data.id}
                            leaveTypeContent={data.leaveType.name}
                            leaveTypeColor={data.leaveType.color}
                            statusTypeContent={
                              statusBadges[data.status].badgeContent
                            }
                            statusTypeColor={statusBadges[data.status].color}
                            startDate={moment(
                              data.startDate._seconds * 1000
                            ).toDate()}
                            endDate={moment(
                              data.endDate._seconds * 1000
                            ).toDate()}
                            duration={data.duration}
                            description={data.description}
                            onApproveClick={() => onApproveButtonClick(data)}
                          ></IncomingRequestBasicCard>
                          <Divider />
                        </div>
                      );
                    })
                  ) : (
                    <Alert severity="info">{NO_INCOMING_REQUEST}</Alert>
                  )}
                </Box>
              </Paper>
            </Grid>
          )}
          {/* Last 5 Request */}
          <Grid item xs={12} xl={isAdmin ? 6 : 12}>
            <Paper className={classes.listCard}>
              <Box padding={2} style={{ borderBottom: "solid 1px #ddd" }}>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box fontWeight={500} fontSize="large">
                    {MY_LEAVE_REQUEST}
                  </Box>
                  {/* <Button href="#text-buttons" size="small">All</Button> */}
                </Box>
              </Box>
              <Box>
                {myRequests.length > 0 ? (
                  myRequests.map((leave, index) => {
                    return (
                      <div key={index}>
                        <LeaveSummaryItem
                          date={moment(leave.startDate.seconds * 1000).toDate()}
                          statusTypeContent={leave.leaveType.name}
                          statusTypeColor={leave.leaveType.color}
                          leaveCount={leave.duration}
                          onItemClick={() => detailHandler(leave.id)}
                        ></LeaveSummaryItem>
                        <Divider />
                      </div>
                    );
                  })
                ) : (
                  <Alert severity="info">{NO_MY_LEAVES_REQUEST}</Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Iyice düsündünüz mü?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Form üzerinde yapmis oldugunuz degisiklikler kalici olacaktir. Devam
            etmek istiyor musunuz ?
          </DialogContentText>
          <DialogContent>
            <TextField
              onChange={handleDescriptionChange}
              fullWidth
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows="4"
              variant="outlined"
            />
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleYesClick}
            color="secondary"
          >
            Done
          </Button>
          <Button variant="contained" onClick={closeDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <SnackBar
        snackbarType={snackbarType}
        snackBarState={snackbarState}
        onClose={() => {
          setSnackbarState(false);
        }}
      ></SnackBar>
    </Container>
  );
};
export default withRouter(Dashboard);
