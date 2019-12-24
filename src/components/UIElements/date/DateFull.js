import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography, Box } from "@material-ui/core";
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
    fontSize: "14px",
    [theme.breakpoints.up("sm")]: {
      fontSize: "16px"
    }
  }
}));

export default function DateFull(props) {
  const classes = useStyles(props);
  moment.locale();   
  return (
    <Grid
      container
      className={classes.mainContainer}
      direction="row"
      wrap="nowrap"
    >
      <Box mr={1}>
        <Typography className={classes.dateText}>{moment(new Date(props.startDate)).format('lll')}</Typography>
      </Box>
      <ArrowForwardIosIcon className={classes.center} size="medium" />
      <Box ml={1}>
        <Typography className={classes.dateText}>{moment(new Date(props.endDate)).format('lll')}</Typography>
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
