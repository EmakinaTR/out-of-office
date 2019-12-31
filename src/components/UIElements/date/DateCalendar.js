import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Box,
  Paper
} from "@material-ui/core";


import PropTypes from "prop-types";
import moment from "moment";
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
  const _parseDate = (date) => {   
    try {
      const _date = moment(date).format("DD/MMM/YYYY");    
      return _date.split("/");
    }
    catch(error) {
      console.log("Date Parse Error: ", error);
      return null;
    }    
  }
  const [day,month,year] = _parseDate(props.date);  

  return (
    <Box className={classes.dateCard}>
    <Box className={classes.day}>{day}</Box>
    <Box className={classes.month}>{month}</Box>
    <Box className={classes.hour}>{year}</Box>
   
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
  textLineHeight: PropTypes.string,
  date: PropTypes.instanceOf(Date)
};

DateCalendar.defaultProps = {
  textFontSize: "1.2rem",
  textLineHeight: "1.6rem"
};