import React from "react";
import { makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import defaultProps from "prop-types";
import PropTypes from "prop-types";
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: props => props.badgecolor,
    color: props => props.color,
    padding: "5px 6px",
    borderRadius: "10px",
    whiteSpace: "nowrap",
    fontSize: "14px",
    lineHeight: "16px",
    marginLeft: props => props.marginleft,
    marginRight: props => props.marginright,
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      fontSize: "16px",
      padding: "5px 12px"
    }
  }
}));

export default function CustomBadge(props) {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return (
    <Badge
      badgeContent={props.badgeContent}
      className={classes.root}
      {...other}
    />
  );
}
CustomBadge.propTypes = {
  marginright: PropTypes.string,
  marginleft: PropTypes.string
};

CustomBadge.defaultProps = {
  backgroundColor: "primary",
  color: "white",
  marginleft: "0",
  marginright: "0"
};
