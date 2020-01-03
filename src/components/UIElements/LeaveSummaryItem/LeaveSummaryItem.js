import React from "react";
import PropTypes from "prop-types";
import DateCalendar from "../date/DateCalendar";
import {
  makeStyles,
  Typography,
  Grid,
  IconButton,
  Box,
  Chip,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { printDayCount } from "../../../utils/displayUtils";

const useStyles = makeStyles(theme => ({
  request: {
    "& > *": {
      margin: theme.spacing(0.5),
      marginLeft: 0
    }
  }
}));

const LeaveSummaryItem = props => {
  const classes = useStyles();
  return ( 
    <Box padding={2}>
      <Box display="flex" flexDirection="row" alignItems="center" style={{minHeight:"5rem"}}>
        <Box flexGrow={1}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={3}>
                <DateCalendar
              date={props.date}
              textFontSize="1rem"
              textLineHeight="1.2rem"
            ></DateCalendar>
            </Grid>
            <Grid item xs={9} className={classes.request}>
  <Typography>{printDayCount(props.leaveCount)}</Typography>              
              <Chip variant="outlined" style={{borderColor: props.statusTypeColor,color:props.statusTypeColor}} size="small" label={props.statusTypeContent} />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <IconButton onClick={() => props.onItemClick()} color="primary" aria-label="Request Detail" component="span">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      
    

 {/* <Grid container alignItems="center">
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
        <CustomBadge badgecolor="red">{props.leaveType}</CustomBadge>
      </Grid>
      <Grid item xs={2}>
        <IconButton color="primary" size="small">
          <ChevronRightIcon fontSize="large"></ChevronRightIcon>
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <Divider className={classes.dividerContainer}></Divider>
      </Grid>
    </Grid> */}
    </Box>
  );
};

LeaveSummaryItem.propTypes = {
  leaveType: PropTypes.string,
  leaveCount: PropTypes.number,
  date: PropTypes.instanceOf(Date)
};

export default LeaveSummaryItem;
