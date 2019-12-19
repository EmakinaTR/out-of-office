import React from "react";
import PropTypes from "prop-types";
import DateCalendar from "../date/DateCalendar";
import {
  makeStyles,
  Typography,
  Grid,
  IconButton,
  Divider
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CustomBadge from "../customBadge/CustomBadge";

const useStyles = makeStyles(theme => ({
  requesterName: {
    textAlign: "left"
  },
  requestCount: {
    textAlign: "left"
  },
  leaveTypeContainer: {
    textAlign: "center"
  },
  dividerContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const LeaveSummaryItem = props => {
  const classes = useStyles();
  return (
    <Grid container alignItems="center">
      <Grid item xs={3}>
        <DateCalendar
          textFontSize="1rem"
          textLineHeight="1.2rem"
        ></DateCalendar>
      </Grid>
      <Grid item xs={2} className={classes.leaveTypeContainer}>
        <Typography>{props.leaveCount}</Typography>
      </Grid>
      <Grid className={classes.leaveTypeContainer} item xs={5}>
        <CustomBadge backgroundColor="red">{props.leaveType}</CustomBadge>
      </Grid>
      <Grid item xs={2}>
        <IconButton color="primary" size="small">
          <ChevronRightIcon fontSize="large"></ChevronRightIcon>
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <Divider className={classes.dividerContainer}></Divider>
      </Grid>
    </Grid>
  );
};

LeaveSummaryItem.propTypes = {
  leaveType: PropTypes.string,
  leaveCount: PropTypes.string
};

export default LeaveSummaryItem;
