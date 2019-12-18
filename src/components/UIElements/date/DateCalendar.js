import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
const useStyles = makeStyles(theme => ({
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
    backgroundColor: "#b3b3b3",
    borderTop: "1px solid black"
  },
  lineHeightControl: {
    lineHeight: props => props.textLineHeight,
    fontSize: props => props.textFontSize
  }
}));

export default function DateCalendar(props) {
  const classes = useStyles(props);

  return (
    <Card className={classes.card}>
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
    </Card>
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
