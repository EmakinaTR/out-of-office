import React,{useContext} from "react";
import InfoCard from "../../components/UIElements/InfoCard/InfoCard";
import {
  Container,
  Grid,
  Card,
  Typography,
  Icon,
  Button,
  IconButton,
  Box,
  Paper,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LeaveSummaryItem from "../../components/UIElements/LeaveSummaryItem/LeaveSummaryItem";
import { statusBadges, leaveBadges } from "../../constants/badgeTypes";
import IncomingRequestCard from "../../components/UIElements/incomingRequestCard";
import { incomingRequestData } from "../../constants/dummyData";
import IncomingRequestBasicCard from "../../components/UIElements/IncomingRequestBasicCard/IncomingRequestBasicCard";
import { FirebaseContext } from "../../components/firebase";
import app from "firebase";
// String sources
const NEW_LEAVE_REQUEST = "Yeni İzin Talebi Oluştur";
const REMAINING_ANNUAL_LEAVE_REQUEST = "Kalan Yıllık İzin";
const REMAINING_CASUAL_LEAVE_REQUEST = "Kalan Mazeret İzni";
const PENDING_LEAVE_REQUEST = "Onay Bekleyen İzin";
const MY_LEAVE_REQUEST = "My Leaves";
const REQUESTED_LEAVES = "Incoming Requests";



// CUSTOM STATIC DATA
const leaves = [
  {
    requesterName: "Efe Uruk",
    leaveType: "Yıllık İzin",
    leaveCount: "1,5 gün"
  },
  {
    requesterName: "Doğukan Uçak",
    leaveType: "Mazeret İzni",
    leaveCount: "1 gün"
  },
  {
    requesterName: "İlker Ünal",
    leaveType: "Yıllık İzin",
    leaveCount: "3 gün"
  },
  {
    requesterName: "Efe Uruk",
    leaveType: "Yıllık İzin",
    leaveCount: "1,5 gün"
  },
  {
    requesterName: "Doğukan Uçak",
    leaveType: "Mazeret İzni",
    leaveCount: "1 gün"
  }
];

const useStyles = makeStyles(theme => ({
  newRequestButton: {
    width: "100%",
    padding: theme.spacing(3),
    paddingRight: "0.5rem",
    alignItems: "center",
    textTransform: "upperCase"
  },
  newRequestButtonText: {
    flex: 1,
    textAlign: "left"
  },
  listCard: {
    // padding: theme.spacing(3),
    // textAlign: "center"
  },
  divider: {
  }
}));

const Dashboard = () => {
  // IsAdmin state will be set through firebase connection
  const [isAdmin, setIsAdmin] = React.useState(true);
  const classes = useStyles();
  const incomingRequests = incomingRequestData.slice(0, 5);

  const firebaseContext = useContext(FirebaseContext);
  const Test = app.functions().httpsCallable('Test');
  Test().then(function(result) {
    console.log("Firebase fun ref: ", result);
  }).catch(error => {
    console.log("Cloud Func Error: ", error);
  });
  

  return (
    <Container maxWidth="xl">
      <Box marginY={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Button
              color="primary"
              variant="contained"
              className={classes.newRequestButton}
            >
              <Typography className={classes.newRequestButtonText}>
                {NEW_LEAVE_REQUEST}
              </Typography>
              <Icon style={{ fontSize: "2rem" }}>add</Icon>
            </Button>
          </Grid>
          {/* Remaining Annual Leave */}
          <Grid item xs={12} lg={6}>
            <InfoCard
              text={REMAINING_ANNUAL_LEAVE_REQUEST}
              count={5}
            ></InfoCard>
          </Grid>
          {/* Remaining Annual Leave */}
          <Grid item xs={12} lg={6}>
            <InfoCard
              text={REMAINING_CASUAL_LEAVE_REQUEST}
              count={2}
            ></InfoCard>
          </Grid>
          {/* Remaining Annual Leave */}
          <Grid item xs={12} lg={6}>
            <InfoCard text={PENDING_LEAVE_REQUEST} count={1}></InfoCard>
          </Grid>

          {/* Incoming Requests - Visible Only For Admin Users */}
          {isAdmin && (
            <Grid item xs={12} xl={6}>
              <Paper className={classes.listCard}>
                <Box
                  padding={2}
                  style={{ borderBottom: "solid 1px #ddd" }}
                >
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
                {incomingRequests.map((data, index) => {
                  return (
                    <div key={index}>
                    <IncomingRequestBasicCard
                      userName={data.userName}
                      leaveTypeContent={
                        leaveBadges[data.leaveType].badgeContent
                      }
                      leaveTypeColor={leaveBadges[data.leaveType].color}
                      statusTypeContent={statusBadges[data.status].badgeContent}
                      statusTypeColor={statusBadges[data.status].color}
                      startDate={data.startDate}
                      endDate={data.endDate}
                      duration={data.duration}
                      description={data.description}
                    ></IncomingRequestBasicCard>
                    <Divider />                    
                    </div>
                  );
                })}
                </Box>
              </Paper>
              </Grid>
          )}
          {/* Last 5 Request */}
          <Grid item xs={12} xl={isAdmin ? 6 : 12}>
          <Paper className={classes.listCard}>
                <Box
                  padding={2}
                  style={{ borderBottom: "solid 1px #ddd" }}
                >
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
              {leaves.map((leave, index) => {
                return (
                  <div key={index}>
                  <LeaveSummaryItem
                    leaveType={leave.leaveType}
                    leaveCount={leave.leaveCount}
                  ></LeaveSummaryItem>
                  <Divider />
                  </div>
                );
              })}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
export default Dashboard;
