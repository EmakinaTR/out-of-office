import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Avatar,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  IconButton,
  Box,
  Chip,
  Hidden
} from "@material-ui/core";
import DateFull from "../date/DateFull";
import MoreDialog from "../moreDialog";
import CheckIcon from "@material-ui/icons/Check";
import { printDayCount } from "../../../utils/displayUtils";
const useStyles = makeStyles(theme => ({
  request: {
    "& > *": {
      margin: theme.spacing(0.5),
      marginLeft: 0
    }
  },
  userName: {
    [theme.breakpoints.up("lg")]: {
      textAlign: "center"
    }
  }
}));
const IncomingRequestBasicCard = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <Box padding={2}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{ minHeight: "5rem" }}
      >
        <Box flexGrow={1}>
          <Grid container spacing={isLargeScreen ? 1 : 0} alignItems="center">
            <Grid item xs={12} lg={3}>
              <Hidden mdDown>
                <Box marginY={0.5} align="center">
                  <Avatar>{props.userName?.charAt(0)}</Avatar>
                </Box>
              </Hidden>
              <Typography className={classes.userName} noWrap>
                {props.userName}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={9} className={classes.request}>
              <DateFull
                justifycontent="flex-start"
                className={classes.dateFull}
                startDate={props.startDate}
                endDate={props.endDate}
              ></DateFull>
              <Chip
                variant="outlined"
                size="small"
                label={printDayCount(props.duration)}
              />
              <Chip
                variant="outlined"
                style={{
                  borderColor: props.leaveTypeColor,
                  color: props.leaveTypeColor
                }}
                size="small"
                label={props.leaveTypeContent}
              />
              {/* <Chip variant="outlined" style={{borderColor: props.statusTypeColor,color:props.statusTypeColor}} size="small" label={props.statusTypeContent} /> */}
            </Grid>
          </Grid>
        </Box>
        <Box>
          <IconButton onClick={props.onApproveClick} color="primary" aria-label="Approve" component="span">
            <CheckIcon></CheckIcon>
          </IconButton>
        </Box>
      </Box>     
    </Box>
  );
};

IncomingRequestBasicCard.propTypes = {
  userName: PropTypes.string
};

export default IncomingRequestBasicCard;
