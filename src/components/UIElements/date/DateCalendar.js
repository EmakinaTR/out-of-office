import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Box,
  Paper
} from "@material-ui/core";


import PropTypes from "prop-types";
const useStyles = makeStyles(theme => ({
  dateCard:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    lineHeight:"1rem"
  },
  day: {
    fontSize:"2rem",
    lineHeight:"2rem",
  },
  month: {
    textTransform: "uppercase"
  },
  hour: {
    fontSize:".85rem",
  },
  card: {
    maxWidth: "80px",
    border: "1px solid black",
    textAlign: "center",
    borderRadius: 0
  },
  cardContent: {
    padding: 0
  },
  time: {
    backgroundColor: "#b3b3b3"
  },
  lineHeightControl: {
    lineHeight: props => props.textLineHeight,
    fontSize: props => props.textFontSize
  }
}));

export default function DateCalendar(props) {
  const classes = useStyles(props);

  return (
    <Box className={classes.dateCard}>
    <Box className={classes.day}>22</Box>
    <Box className={classes.month}>Ara</Box>
    <Box className={classes.hour}>09:00</Box>
   
    {/* <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" className={classes.lineHeightControl}>
          15
        </Typography>
        <Typography variant="h6" className={classes.lineHeightControl}>
          Ara
        </Typography>
        <Typography variant="h6" className={classes.lineHeightControl}>
          2019
        </Typography>
      </CardContent>
      <Box className={classes.time}>
        <Typography>09:00</Typography>
      </Box>
    </Card> */}
    </Box>
  );
}

DateCalendar.propTypes = {
  textFontSize: PropTypes.string,
  textLineHeight: PropTypes.string
};

DateCalendar.defaultProps = {
  textFontSize: "1.2rem",
  textLineHeight: "1.6rem"
};