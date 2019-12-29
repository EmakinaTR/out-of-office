import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography, Box, useMediaQuery, useTheme } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import moment from 'moment';
import 'moment/locale/tr';
moment().locale('tr')
const useStyles = makeStyles(theme => ({
  mainContainer: {
    display: "flex",
    justifyContent: props => props.justifycontent
  },
  center: {
    fontSize: "16px",
    alignSelf: "center",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px"
    }
  },
  dateText: {
    fontWeight: "normal",
    fontSize: ".9rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.1rem"
    }
  }
}));

export default function DateFull(props) {
  const classes = useStyles(props);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  moment.locale();   
  return (
    <Grid
      container
      className={classes.mainContainer}
      direction="row"
      wrap="nowrap"
    >
      <Box mr={1}>
        <Typography className={classes.dateText}>
        {isLargeScreen
            ? moment(new Date(props.startDate._seconds * 1000)).format("lll")
            : moment(new Date(props.startDate._seconds * 1000)).format(
              "MM/DD/YYYY, H:mm"
            )}                              
        </Typography>
      </Box>
      <ArrowForwardIosIcon className={classes.center} style={{ color: "#aaa" }} />
      <Box ml={1}>
        <Typography className={classes.dateText}>
          {isLargeScreen
            ? moment(new Date(props.endDate._seconds * 1000)).format("lll")
            : moment(new Date(props.endDate._seconds * 1000)).format(
                "MM/DD/YYYY, H:mm"
              )}
        </Typography>
      </Box>
    </Grid>
  );
}

DateFull.propTypes = {
  justifycontent: PropTypes.string
};
DateFull.defaultProps = {
  justifycontent: "flex-start"
};
