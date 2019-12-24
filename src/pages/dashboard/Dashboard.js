import React from "react";
import InfoCard from "../../components/UIElements/InfoCard/InfoCard";
import {
  Container,
  Grid,
  Card,
  Typography,
  Icon,
  Button,
  Box
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import LeaveSummaryItem from "../../components/UIElements/LeaveSummaryItem/LeaveSummaryItem";
import { statusBadges, leaveBadges } from "../../constants/badgeTypes";
import IncomingRequestCard from "../../components/UIElements/incomingRequestCard";
import { incomingRequestData } from "../../constants/dummyData";
import RequestedLeaveItem from "../../components/UIElements/RequestedLeaveItem/RequestedLeaveItem";

// String sources
const NEW_LEAVE_REQUEST = "Yeni İzin Talebi Oluştur";
const REMAINING_ANNUAL_LEAVE_REQUEST = "Kalan Yıllık İzin";
const REMAINING_CASUAL_LEAVE_REQUEST = "Kalan Mazeret İzni";
const PENDING_LEAVE_REQUEST = "Onay Bekleyen İzin";
const MY_LEAVE_REQUEST = "Son 5 İzin";
const REQUESTED_LEAVES = "Talep Edilen İzinler";

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
    padding: theme.spacing(3),
    textAlign: "center"
  }
}));

const Dashboard = () => {
  // IsAdmin state will be set through firebase connection
  const [isAdmin, setIsAdmin] = React.useState(true);
  const classes = useStyles();
  const incomingRequests = incomingRequestData.slice(0, 5);
  return (
    <Container maxWidth="xl">
      <Box marginY={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button
            color="secondary"
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
        <Grid item xs={12} md={6}>
          <InfoCard text={REMAINING_ANNUAL_LEAVE_REQUEST} count={5}></InfoCard>
        </Grid>
        {/* Remaining Annual Leave */}
        <Grid item xs={12} md={6}>
          <InfoCard text={REMAINING_CASUAL_LEAVE_REQUEST} count={2}></InfoCard>
        </Grid>
        {/* Remaining Annual Leave */}
        <Grid item xs={12} md={6}>
          <InfoCard text={PENDING_LEAVE_REQUEST} count={1}></InfoCard>
        </Grid>
      </Grid>
      
      
      <Grid container spacing={3}>
        {/* Incoming Requests - Visible Only For Admin Users */}
        {isAdmin && (
          <Grid item xs={12} md={12} lg={6}>
            <Card className={classes.listCard}>
              {REQUESTED_LEAVES}
              {incomingRequests.map((data, index) => {
                return (
                  <RequestedLeaveItem
                    key={index}
                    userName={data.userName}
                    leaveTypeContent={leaveBadges[data.leaveType].badgeContent}
                    leaveTypeColor={leaveBadges[data.leaveType].color}
                    statusTypeContent={statusBadges[data.status].badgeContent}
                    statusTypeColor={statusBadges[data.status].color}
                    startDate={data.startDate}
                    endDate={data.endDate}
                    dayCount={data.dayCount}
                    description={data.description}
                  ></RequestedLeaveItem>
                );
              })}
            </Card>
          </Grid>
        )}
        {/* Last 5 Request */}
        <Grid item xs={12} md={12} lg={6}>
          <Card className={classes.listCard}>
            {MY_LEAVE_REQUEST}
            {leaves.map((leave, index) => {
              return (
                <LeaveSummaryItem
                  key={index}
                  leaveType={leave.leaveType}
                  leaveCount={leave.leaveCount}
                ></LeaveSummaryItem>
              );
            })}
          </Card>
        </Grid>
      </Grid>
      </Box>
      </Container>
  );
};
export default Dashboard;
