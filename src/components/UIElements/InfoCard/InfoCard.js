import React from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  card: { display: "flex", padding: theme.spacing(2), alignItems: "center" },
  infoText: {
    textTransform: "uppercase",
    flex: 1
  },
  infoCount: {
    fontWeight: "bold"
  }
}));

const customStyles = {
  infoCountCustomStyle: {
    fontSize: "2rem"
  }
};

const InfoCard = props => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Typography className={classes.infoText}>{props.text}</Typography>
      <Typography
        style={customStyles.infoCountCustomStyle}
        className={classes.infoCount}
      >
        {props.count}
      </Typography>
    </Card>
  );
};

InfoCard.propTypes = {
  count: PropTypes.number,
  text: PropTypes.string
};

InfoCard.defaultProps = {
  count: 0,
  text: ""
};

export default InfoCard;
